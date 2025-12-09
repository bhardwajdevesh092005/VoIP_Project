import { toast } from '../../Utils/toast.js'

export const handlePeerOnline = () => (data) => {
    console.log('Call peer is back online:', data)
    toast.success('Your peer reconnected!')
}
