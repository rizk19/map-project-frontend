// $(document).ready(() => {
//     var inputUpload = document.getElementById('input-db-upload')
//     let headers = new Headers();
//     headers.append("Accept", "application/json");

//     inputUpload.addEventListener('change', function () {
//         // Called when files change. You can for example:
//         // - Access the selected files
//         var singleFile = inputUpload.files[0]
//         // console.log('upload', singleFile);
//         // - Submit the form
//         // console.log(singleFile);
//         // var filePath = $(this).val();
//         const dataUpload = new FormData();
//         if (singleFile) {
//             $("#label-db-upload").text(singleFile.name);

//             dataUpload.append("uploadedDb", singleFile);
            
//             $("#button-db-upload").click(function () {
//                 // $.ajaxSetup({
//                 //     headers: {
//                 //         "Content-Type": "application/json"
//                 //     }
//                 // });
//                 console.log('POST',dataUpload);
                
//                 $.ajax({
//                     type: 'POST',
//                     // headers: {  'Access-Control-Allow-Origin': "*", "Content-Type": "application/json" },
//                     url: 'http://localhost:5000/maps',
//                     data: dataUpload,
//                     processData: false,
//                     contentType: false,
//                     // dataType: 'jsonp',
//                     crossDomain: true,
//                     success: function (data) {
//                         // data.json()
//                         console.log(data);
//                     },
//                     error: function (data) {
//                         console.log('Error:', data);
//                     }
//                 })
//                     // .then(res => console.log(res)
//                     // )
//                     // .catch(err => console.log(err)
//                     // )
//             });
//         }

//     }, false);
//     // $("#button-db-upload").click(function () {
//     //     alert("The button was clicked.");
//     // });
// })