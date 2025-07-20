let ioInstance = null;

exports.initSocket = (io) => {
  ioInstance = io;
};

exports.emitOrderUpdate = (orderId, status) => {
  if (ioInstance) {
    ioInstance.to(orderId).emit('orderStatus', { orderId, status });
    console.log(`Order ${orderId} status: ${status}`);
  }
};

exports.subscribeOrder = (socket, orderId) => {
  socket.join(orderId);
  console.log(`Socket ${socket.id} joined order ${orderId}`);
}; 