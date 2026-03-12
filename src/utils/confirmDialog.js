export const showConfirmDialog = (title, message, confirmText, cancelText) => {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div class="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
          <h3 class="text-xl font-semibold text-white">${title}</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-700 mb-6">${message}</p>
          <div class="flex space-x-3 justify-end">
            <button id="cancel-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
              ${cancelText}
            </button>
            <button id="confirm-btn" class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium">
              ${confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#confirm-btn').onclick = () => {
      modal.remove();
      resolve(true);
    };
    
    modal.querySelector('#cancel-btn').onclick = () => {
      modal.remove();
      resolve(false);
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(false);
      }
    };
  });
};