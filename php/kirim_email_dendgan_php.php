# kirim email dengan php 


```bash
composer require phpmailer/phpmailer
```


```php

use \Simplon\Mysql\Mysql;
use \Simplon\Mysql\PDOConnector;


  //Create a new PHPMailer instance
    $mail = new PHPMailer;   
    $mail->isSMTP();
// change this to 0 if the site is going live
    $mail->SMTPDebug = 2;
    $mail->Debugoutput = 'html';
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = 'tls';

    //use SMTP authentication
    $mail->SMTPAuth = true;
    //Username to use for SMTP authentication
    $mail->Username = "makuroworkshop@gmail.com";
    $mail->Password = "makuro123";
    $mail->setFrom('malik@gmail.com', 'Somebody');
    $mail->addAddress('maliksekeluarga@gmail.com', 'Somebody');
    $mail->Subject = 'New contact from somebody';
    
    // $message is gotten from the form
    $mail->msgHTML("<h1>apa kabar</h1>");
    if (!$mail->send()) {
        echo "We are extremely sorry to inform you that your message";
    } else {
        echo "Your message was successfully delivered,you would be contacted shortly.";
    }
    
```
