$(document).ready(() => {

    function getDirectory(params, title, path) {

        $("#modal-title-database").text(title)
        $("#direktori-lokasi").text(path)
        
        let listscripts = ``
        params.forEach((item, index) => {
            listscripts += `<button value="${item}" id="list-database-id" class="list-group-item list-group-item-action list-group-item-primary">${item.split('/')[item.split('/').length - 1]}</button>`
        });
        $('#list-usb-database').html(listscripts);
        let listButton = document.getElementsByClassName("list-group-item");
        Object.keys(listButton).map(async function (key) {
            let button = listButton[key];
            button.addEventListener("click", async function () {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: `Database ${button.value.split('/')[button.value.split('/').length - 1]} Selected`,
                    showConfirmButton: false,
                    timer: 2000
                }).then((result) => {
                    if (result) {
                        $(".map").empty();
                        $("#table-data").empty();

                        let spinnerscripts = `<div id="popup"></div>
                                            <div id="map-spinner" class="text-center align-content-center">
                                                <div class="text-center align-self-center" style="padding-top: 30vh;">
                                                    <div class="spinner-border text-primary" style="width: 10rem; height: 10rem;" role="status">
                                                    </div>
                                                </div>
                                            </div>`

                        let spinnertable = `<div id="table-spinner" class="text-center align-content-center">
                                                <div class="text-center align-self-center" style="padding-top: 30vh;">
                                                    <div class="spinner-border text-primary" style="width: 10rem; height: 10rem;" role="status">
                                                    </div>
                                                </div>
                                            </div>`
                        $(".map").html(spinnerscripts)
                        $("#table-data").html(spinnertable)
                        // console.log('newselecteddb.js line 40 ===> ',button.value.split('/')[button.value.split('/').length - 1]);
                        $('#Modal').modal('hide');
                        socketMaps.emit('selectedDB', button.value);
                    }
                })
            })
        })
    }

    socketMaps.on("usbfile", (datausb) => {
        $('#Modal').modal('show');
        getDirectory(datausb.fullpath, 'List Database dari USB', datausb.rawpath)
    })


    socketMaps.on("listDirectory", (list) => {
        $('#direktori-list').click(function () {
            $('#Modal').modal('show');
            getDirectory(list.fullpath, 'List Database dari Direktori', list.rawpath)
        });
    })


    socketMaps.on("usbdisconnect", (datadisc) => {
        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'USB ' + datadisc.status,
            showConfirmButton: false,
            timer: 2000
        })
    })


})