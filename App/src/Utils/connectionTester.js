/**
 * WebRTC Connection Test Utility
 * Use this in the browser console to test TCP/UDP connectivity
 */

class WebRTCConnectionTester {
    constructor() {
        this.results = {
            stun: { tested: false, accessible: false, protocols: [] },
            turn: { tested: false, accessible: false, protocols: [] },
            candidates: { tcp: [], udp: [] },
            summary: ''
        };
    }

    /**
     * Test STUN and TURN server connectivity
     */
    async testConnectivity() {
        console.log('🔍 Starting WebRTC connectivity test...\n');

        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
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
            iceTransportPolicy: 'all',
            iceCandidatePoolSize: 10
        };

        const pc = new RTCPeerConnection(config);

        return new Promise((resolve) => {
            // Track ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    const candidate = event.candidate;
                    const protocol = candidate.protocol;
                    const type = candidate.type;

                    console.log(`📨 Candidate: ${protocol.toUpperCase()} - ${type}`);

                    if (protocol === 'tcp') {
                        this.results.candidates.tcp.push({
                            type,
                            protocol,
                            address: candidate.address,
                            port: candidate.port,
                            tcpType: candidate.tcpType
                        });
                    } else if (protocol === 'udp') {
                        this.results.candidates.udp.push({
                            type,
                            protocol,
                            address: candidate.address,
                            port: candidate.port
                        });
                    }

                    // Check for STUN candidates
                    if (type === 'srflx') {
                        this.results.stun.tested = true;
                        this.results.stun.accessible = true;
                        if (!this.results.stun.protocols.includes(protocol)) {
                            this.results.stun.protocols.push(protocol);
                        }
                    }

                    // Check for TURN candidates
                    if (type === 'relay') {
                        this.results.turn.tested = true;
                        this.results.turn.accessible = true;
                        if (!this.results.turn.protocols.includes(protocol)) {
                            this.results.turn.protocols.push(protocol);
                        }
                    }
                }
            };

            // Listen for gathering completion
            pc.onicegatheringstatechange = () => {
                console.log(`ICE gathering state: ${pc.iceGatheringState}`);
                
                if (pc.iceGatheringState === 'complete') {
                    this.generateReport();
                    pc.close();
                    resolve(this.results);
                }
            };

            // Create a dummy offer to trigger ICE gathering
            pc.createDataChannel('test');
            pc.createOffer()
                .then(offer => pc.setLocalDescription(offer))
                .catch(error => {
                    console.error('Error creating offer:', error);
                    resolve(this.results);
                });

            // Timeout after 10 seconds
            setTimeout(() => {
                console.log('⏱️  Test timeout reached');
                this.generateReport();
                pc.close();
                resolve(this.results);
            }, 10000);
        });
    }

    /**
     * Generate and display connectivity report
     */
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 WebRTC Connectivity Test Report');
        console.log('='.repeat(60) + '\n');

        // TCP Candidates
        console.log(`🔷 TCP Candidates: ${this.results.candidates.tcp.length}`);
        if (this.results.candidates.tcp.length > 0) {
            this.results.candidates.tcp.forEach((c, i) => {
                console.log(`   ${i + 1}. Type: ${c.type}, TCP Type: ${c.tcpType || 'N/A'}, Port: ${c.port}`);
            });
        } else {
            console.log('   ⚠️  No TCP candidates gathered');
        }

        console.log('');

        // UDP Candidates
        console.log(`🔶 UDP Candidates: ${this.results.candidates.udp.length}`);
        if (this.results.candidates.udp.length > 0) {
            this.results.candidates.udp.forEach((c, i) => {
                console.log(`   ${i + 1}. Type: ${c.type}, Port: ${c.port}`);
            });
        } else {
            console.log('   ⚠️  No UDP candidates gathered');
        }

        console.log('');

        // STUN Status
        console.log('🌐 STUN Server Status:');
        if (this.results.stun.accessible) {
            console.log(`   ✅ Accessible via: ${this.results.stun.protocols.join(', ').toUpperCase()}`);
        } else {
            console.log('   ❌ Not accessible or blocked');
        }

        console.log('');

        // TURN Status
        console.log('🔄 TURN Server Status:');
        if (this.results.turn.accessible) {
            console.log(`   ✅ Accessible via: ${this.results.turn.protocols.join(', ').toUpperCase()}`);
        } else {
            console.log('   ❌ Not accessible or blocked');
        }

        console.log('');

        // Summary
        console.log('📝 Summary:');
        const tcpCount = this.results.candidates.tcp.length;
        const udpCount = this.results.candidates.udp.length;

        if (tcpCount > 0 && udpCount > 0) {
            console.log('   ✅ Both TCP and UDP connections are supported');
            this.results.summary = 'EXCELLENT - Full connectivity';
        } else if (udpCount > 0) {
            console.log('   ⚠️  Only UDP connections available (TCP may be blocked)');
            this.results.summary = 'GOOD - UDP only';
        } else if (tcpCount > 0) {
            console.log('   ⚠️  Only TCP connections available (UDP may be blocked)');
            this.results.summary = 'FAIR - TCP only (may have higher latency)';
        } else {
            console.log('   ❌ No connections available - connectivity issues detected');
            this.results.summary = 'POOR - No connectivity';
        }

        console.log('\n' + '='.repeat(60) + '\n');
    }

    /**
     * Get results as JSON
     */
    getResults() {
        return this.results;
    }
}

// Make it available globally for console usage
if (typeof window !== 'undefined') {
    window.WebRTCConnectionTester = WebRTCConnectionTester;
}

// Export for module usage
export { WebRTCConnectionTester };

// Quick test function
export async function testWebRTCConnectivity() {
    const tester = new WebRTCConnectionTester();
    return await tester.testConnectivity();
}

// Instructions
console.log(`
%c WebRTC Connection Tester Available! 

To test your connection, run in the console:
const tester = new WebRTCConnectionTester();
await tester.testConnectivity();

Or simply:
testWebRTCConnectivity();
`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
