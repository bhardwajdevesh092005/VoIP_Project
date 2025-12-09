import { toast } from '../../Utils/toast.js'

export const handlePeerOffline = () => (data) => {
    console.log('Call peer went offline:', data)
    toast.warning('Your peer temporarily lost connection...')
}
