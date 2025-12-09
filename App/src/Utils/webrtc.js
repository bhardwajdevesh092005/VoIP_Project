/**
 * WebRTC Utility for Audio-Only Peer-to-Peer Connection
 */

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN servers for TCP relay if UDP is blocked
        {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        }
    ],
    // Allow both TCP and UDP connections
    iceTransportPolicy: 'all',
    // Enable gathering of both TCP and UDP candidates
    iceCandidatePoolSize: 10
};

class WebRTCManager {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.socket = null;
        this.onRemoteStreamCallback = null;
        this.onConnectionStateChangeCallback = null;
        this.iceCandidateQueue = []; // Queue for candidates received before remote description
    }

    /**
     * Initialize WebRTC connection
     * @param {Socket} socket - Socket.IO instance
     */
    setSocket(socket) {
        this.socket = socket;
    }

    /**
     * Create peer connection
     */
    createPeerConnection() {
        this.peerConnection = new RTCPeerConnection(ICE_SERVERS);
        this.tcpConnected = false;
        this.udpConnected = false;

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.socket) {
                // Log candidate type (TCP or UDP)
                const protocol = event.candidate.protocol;
                const type = event.candidate.type;
                console.log(`Sending ICE candidate - Protocol: ${protocol}, Type: ${type}`);
                
                this.socket.emit('ice:candidate', {
                    candidate: event.candidate
                });
            }
        };

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('Received remote track:', event.streams[0]);
            this.remoteStream = event.streams[0];
            if (this.onRemoteStreamCallback) {
                this.onRemoteStreamCallback(event.streams[0]);
            }
        };

        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection.connectionState);
            if (this.onConnectionStateChangeCallback) {
                this.onConnectionStateChangeCallback(this.peerConnection.connectionState);
            }
        };

        // Handle ICE connection state changes
        this.peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', this.peerConnection.iceConnectionState);
            
            // Check which transport protocols are being used
            if (this.peerConnection.iceConnectionState === 'connected' || 
                this.peerConnection.iceConnectionState === 'completed') {
                this.checkActiveTransports();
            }
        };

        return this.peerConnection;
    }

    /**
     * Get local audio stream
     */
    async getLocalStream() {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia is not supported in this browser');
            }

            // Request microphone permission with mobile-friendly constraints
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    // Mobile-friendly: don't request specific sample rates or channels
                    // Let the device use its defaults
                },
                video: false
            });
            
            console.log('Local audio stream obtained');
            return this.localStream;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            
            // Provide specific error messages
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                throw new Error('Microphone permission denied. Please allow microphone access in your browser settings.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                throw new Error('No microphone found. Please connect a microphone and try again.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                throw new Error('Microphone is already in use by another application.');
            } else if (error.name === 'OverconstrainedError') {
                throw new Error('Could not satisfy audio constraints. Please try again.');
            } else if (error.name === 'SecurityError') {
                throw new Error('Microphone access blocked due to security restrictions. Please use HTTPS.');
            } else {
                throw new Error(`Microphone access failed: ${error.message}`);
            }
        }
    }

    /**
     * Create offer (caller side)
     */
    async createOffer() {
        try {
            if (!this.peerConnection) {
                this.createPeerConnection();
            }

            // Get local stream and add to peer connection
            await this.getLocalStream();
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Create offer with both TCP and UDP candidates
            const offer = await this.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: false,
                iceRestart: false
            });
            await this.peerConnection.setLocalDescription(offer);

            // Wait for ICE gathering to complete to ensure both TCP and UDP candidates are collected
            await this.waitForIceGathering();

            console.log('Created offer with complete ICE candidates:', {
                type: offer.type,
                sdp: offer.sdp
            });
            
            return this.peerConnection.localDescription;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    /**
     * Create answer (callee side)
     * @param {RTCSessionDescriptionInit} offer - Remote offer
     */
    async createAnswer(offer) {
        try {
            if (!this.peerConnection) {
                this.createPeerConnection();
            }

            // Get local stream and add to peer connection
            await this.getLocalStream();
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream);
            });

            // Set remote description
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

            // Process queued ICE candidates now that remote description is set
            await this.processIceCandidateQueue();

            // Create answer with both TCP and UDP candidates
            const answer = await this.peerConnection.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: false
            });
            await this.peerConnection.setLocalDescription(answer);

            // Wait for ICE gathering to complete to ensure both TCP and UDP candidates are collected
            await this.waitForIceGathering();

            console.log('Created answer with complete ICE candidates:', {
                type: answer.type,
                sdp: answer.sdp
            });
            
            return this.peerConnection.localDescription;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    /**
     * Handle received answer (caller side)
     * @param {RTCSessionDescriptionInit} answer - Remote answer
     */
    async handleAnswer(answer) {
        try {
            if (!this.peerConnection) {
                throw new Error('Peer connection not initialized');
            }

            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            console.log('Set remote description (answer)');

            // Process queued ICE candidates now that remote description is set
            await this.processIceCandidateQueue();
        } catch (error) {
            console.error('Error handling answer:', error);
            throw error;
        }
    }

    /**
     * Process queued ICE candidates
     */
    async processIceCandidateQueue() {
        if (this.iceCandidateQueue.length > 0) {
            console.log(`Processing ${this.iceCandidateQueue.length} queued ICE candidates`);
            for (const candidate of this.iceCandidateQueue) {
                try {
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    console.log('Added queued ICE candidate');
                } catch (error) {
                    console.error('Error adding queued ICE candidate:', error);
                }
            }
            this.iceCandidateQueue = [];
        }
    }

    /**
     * Wait for ICE gathering to complete to ensure both TCP and UDP candidates are collected
     */
    async waitForIceGathering() {
        if (!this.peerConnection) {
            return;
        }

        return new Promise((resolve) => {
            // If gathering is already complete, resolve immediately
            if (this.peerConnection.iceGatheringState === 'complete') {
                console.log('ICE gathering already complete');
                this.logGatheredCandidates();
                resolve();
                return;
            }

            // Set a timeout to prevent hanging (max 5 seconds)
            const timeout = setTimeout(() => {
                console.log('ICE gathering timeout reached');
                this.logGatheredCandidates();
                resolve();
            }, 5000);

            // Listen for gathering state changes
            const onGatheringStateChange = () => {
                console.log('ICE gathering state:', this.peerConnection.iceGatheringState);
                
                if (this.peerConnection.iceGatheringState === 'complete') {
                    clearTimeout(timeout);
                    this.peerConnection.removeEventListener('icegatheringstatechange', onGatheringStateChange);
                    console.log('✅ ICE gathering completed');
                    this.logGatheredCandidates();
                    resolve();
                }
            };

            this.peerConnection.addEventListener('icegatheringstatechange', onGatheringStateChange);
        });
    }

    /**
     * Log gathered ICE candidates (TCP and UDP)
     */
    logGatheredCandidates() {
        if (!this.peerConnection || !this.peerConnection.localDescription) {
            return;
        }

        const sdp = this.peerConnection.localDescription.sdp;
        const tcpCandidates = (sdp.match(/a=candidate.*tcp/g) || []).length;
        const udpCandidates = (sdp.match(/a=candidate.*udp/g) || []).length;

        console.log(`📊 Gathered ICE Candidates - TCP: ${tcpCandidates}, UDP: ${udpCandidates}`);
        
        if (tcpCandidates > 0 && udpCandidates > 0) {
            console.log('✅ Both TCP and UDP candidates gathered successfully');
        } else if (tcpCandidates > 0) {
            console.log('⚠️  Only TCP candidates gathered');
        } else if (udpCandidates > 0) {
            console.log('⚠️  Only UDP candidates gathered');
        } else {
            console.log('❌ No candidates gathered');
        }
    }

    /**
     * Add ICE candidate
     * @param {RTCIceCandidateInit} candidate - ICE candidate
     */
    async addIceCandidate(candidate) {
        try {
            if (!this.peerConnection) {
                console.warn('Peer connection not ready, cannot queue ICE candidate');
                return;
            }

            // Check if remote description is set
            if (!this.peerConnection.remoteDescription) {
                console.log('Remote description not set yet, queueing ICE candidate');
                this.iceCandidateQueue.push(candidate);
                return;
            }

            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('Added ICE candidate');
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
        }
    }

    /**
     * Set callback for remote stream
     */
    onRemoteStream(callback) {
        this.onRemoteStreamCallback = callback;
    }

    /**
     * Set callback for connection state change
     */
    onConnectionStateChange(callback) {
        this.onConnectionStateChangeCallback = callback;
    }

    /**
     * Close connection and cleanup
     */
    close() {
        console.log('Closing WebRTC connection and cleaning up all streams');

        // Stop all local stream tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
                console.log('Stopped local track:', track.kind);
            });
            this.localStream = null;
        }

        // Stop all remote stream tracks
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => {
                track.stop();
                console.log('Stopped remote track:', track.kind);
            });
            this.remoteStream = null;
        }

        // Close peer connection
        if (this.peerConnection) {
            // Remove all tracks from the connection
            this.peerConnection.getSenders().forEach(sender => {
                if (sender.track) {
                    sender.track.stop();
                }
                this.peerConnection.removeTrack(sender);
            });

            // Close the connection
            this.peerConnection.close();
            this.peerConnection = null;
            console.log('Peer connection closed');
        }

        // Clear audio element
        const audioElement = document.getElementById('remote-audio');
        if (audioElement) {
            audioElement.srcObject = null;
            audioElement.pause();
            audioElement.load();
            console.log('Cleared remote audio element');
        }

        // Reset all state
        this.iceCandidateQueue = [];
        this.onRemoteStreamCallback = null;
        this.onConnectionStateChangeCallback = null;
        
        console.log('WebRTC cleanup complete');
    }

    /**
     * Toggle audio mute
     */
    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    }

    /**
     * Check and log active transport protocols (TCP/UDP)
     */
    async checkActiveTransports() {
        if (!this.peerConnection) {
            return;
        }

        try {
            const stats = await this.peerConnection.getStats();
            const tcpCandidates = [];
            const udpCandidates = [];
            
            stats.forEach(report => {
                // Check for candidate pairs that are being used
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                    console.log('Active candidate pair:', {
                        localProtocol: report.localCandidateId,
                        remoteProtocol: report.remoteCandidateId,
                        state: report.state,
                        nominated: report.nominated
                    });
                }
                
                // Check local and remote candidates
                if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
                    const protocol = report.protocol;
                    const candidateType = report.candidateType;
                    
                    if (protocol === 'tcp') {
                        tcpCandidates.push({
                            type: report.type,
                            protocol: protocol,
                            candidateType: candidateType,
                            address: report.address,
                            port: report.port
                        });
                    } else if (protocol === 'udp') {
                        udpCandidates.push({
                            type: report.type,
                            protocol: protocol,
                            candidateType: candidateType,
                            address: report.address,
                            port: report.port
                        });
                    }
                }
            });

            // Log the results
            if (tcpCandidates.length > 0) {
                console.log('✅ TCP Connection established:', tcpCandidates);
                this.tcpConnected = true;
            }
            
            if (udpCandidates.length > 0) {
                console.log('✅ UDP Connection established:', udpCandidates);
                this.udpConnected = true;
            }

            console.log(`Connection Summary - TCP: ${this.tcpConnected ? 'Connected' : 'Not Connected'}, UDP: ${this.udpConnected ? 'Connected' : 'Not Connected'}`);
            
            // Return detailed statistics
            return {
                tcp: {
                    connected: this.tcpConnected,
                    candidates: tcpCandidates
                },
                udp: {
                    connected: this.udpConnected,
                    candidates: udpCandidates
                }
            };
        } catch (error) {
            console.error('Error checking active transports:', error);
            return null;
        }
    }

    /**
     * Get detailed connection statistics
     */
    async getConnectionStats() {
        if (!this.peerConnection) {
            return null;
        }

        try {
            const stats = await this.peerConnection.getStats();
            const connectionStats = {
                tcp: [],
                udp: [],
                activePair: null
            };

            stats.forEach(report => {
                if (report.type === 'candidate-pair') {
                    if (report.state === 'succeeded' || report.nominated) {
                        connectionStats.activePair = {
                            localCandidateId: report.localCandidateId,
                            remoteCandidateId: report.remoteCandidateId,
                            state: report.state,
                            priority: report.priority,
                            nominated: report.nominated,
                            bytesSent: report.bytesSent,
                            bytesReceived: report.bytesReceived
                        };
                    }
                }

                if (report.type === 'local-candidate') {
                    const candidate = {
                        protocol: report.protocol,
                        candidateType: report.candidateType,
                        address: report.address,
                        port: report.port,
                        priority: report.priority
                    };

                    if (report.protocol === 'tcp') {
                        connectionStats.tcp.push(candidate);
                    } else if (report.protocol === 'udp') {
                        connectionStats.udp.push(candidate);
                    }
                }
            });

            return connectionStats;
        } catch (error) {
            console.error('Error getting connection stats:', error);
            return null;
        }
    }
}

// Export singleton instance
export const webrtcManager = new WebRTCManager();
