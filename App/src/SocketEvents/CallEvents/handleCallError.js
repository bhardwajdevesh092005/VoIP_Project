import { toast } from '../../Utils/toast.js'

export const handleCallError = () => (data) => {
    console.error('Call error:', data.message)
    toast.error(data.message)
}
