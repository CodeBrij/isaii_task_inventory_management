import { useInventoryStore } from '../stores/useInventoryStore.js'
import { FiX } from 'react-icons/fi'

export default function MailModal() {
  const { closeModal } = useInventoryStore()

  return (
    <div className="fixed inset-0 bg-base-200/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Send Mail</h3>
          <button onClick={() => closeModal('mail')}><FiX /></button>
        </div>
        {/* mail form */}
        <form>
          <input type="email" placeholder="To" className="w-full mb-2 p-2 border rounded" />
          <input type="text" placeholder="Subject" className="w-full mb-2 p-2 border rounded" />
          <textarea placeholder="Message" className="w-full mb-4 p-2 border rounded h-24" />
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
