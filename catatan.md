# catatan project

1. runtype ( jenis data yang berbeda. )
    - tidak konsisten pada response data , parameter success tidak selalu ada disetiap response, yang bisa digunakan sebagai detektor parameter keberhasilan atau kegagalan serponse , malahan menghasilkan null
       __jika user telah terdaftar__
       
       `{success: false, message: User Sudah Terdafar, data: []}`
       
       _jika user berhasil mendaftar_
       
       `{token_type: Bearer, expires_in: 604800, access_token: token}`
       
       _yang seharusnya_
       
       `{success: true, token_type: Bearer, expires_in: 604800, access_token: token}`
       
       ### peruntukan
       
       ```dart
       
       if(!res.body['success']){
        Get.dialog(
          AlertDialog(
            title: Text("ALERT"),
            content: Text(res.body['message']),
            actions: [
              TextButton(
                onPressed: () => Get.back(), 
                child: Text("OK")
              )
            ],
          )
        );

        return;
      }

      print(res.body);
      
    }
    
    ```
