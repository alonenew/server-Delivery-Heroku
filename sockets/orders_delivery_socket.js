module.exports = (io) => {

    const orderDeliveryNamespace = io.of('/orders/delivery');
    orderDeliveryNamespace.on('connection', function(socket) {

        socket.on('position', function(data) {
            console.log(`EMITIO ${JSON.stringify(data)}`);
            orderDeliveryNamespace.emit(`position/${data.id_order}`, { lat: data.lat, lng: data.lng  });
        });

        socket.on('disconnect', function(data) {
        });
    });

}