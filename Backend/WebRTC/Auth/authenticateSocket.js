import jwt from 'jsonwebtoken';
export const authenticateSocket = (socket, next) => {
    const token = socket.request.headers.cookie
        ?.split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

    if (!token) {
        console.log('No token provided in socket connection');
        socket.emit('auth:error', { message: 'No token provided' });
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if (!payload) {
            socket.emit('auth:error', { message: 'Invalid token' });
            return next(new Error('Authentication error: Invalid token'));
        }

        socket.user = {
            id: payload._id,
            email: payload.email
        };
        
        // Emit success event
        socket.emit('auth:success', { 
            message: 'Authentication successful',
            user: {
                id: payload._id,
                email: payload.email
            }
        });
        // If token is valid, proceed to the next middleware
        next(); 
    } catch (error) {
        console.log('Token verification failed:', error.message);
        socket.emit('auth:error', { message: 'Token verification failed', error: error.message });
        return next(new Error('Authentication error: ' + error.message));
    }
}