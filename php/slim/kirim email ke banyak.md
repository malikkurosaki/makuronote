# kirim email ke banyak

- pakai php mailer

```php
<?php
namespace Malik;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class EmailController{
    protected $con;

    public function __construct($con){
        $this->con = $con;
    }

    public function email($req,$con){
        return $this->con->twig->render($res,'email.html');
    }

    public function kirimEmail($req,$res){
        $data = \json_decode($req->getBody(),true);
        $id['id'] = $data['konten_id'];
        $konten = $this->con->db->connect()->fetchRow('select * from konten where id = :id',$id);
        
        if(\is_null($konten)){
            return $res->withJson(['res'=>false]);
        }

        $mail = new PHPMailer(true);   
        $mail->isSMTP();
        // change this to 0 if the site is going live
        $mail->SMTPDebug = false; 
        $mail->Debugoutput = 'html';
        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';

        //use SMTP authentication
        $mail->SMTPAuth = true;
        //Username to use for SMTP authentication
        $mail->Username = "maliksekeluarga@gmail.com";
        $mail->Password = "makuro123";
        $mail->setFrom('probussystem@probussystem.com', 'probus system');
        $mail->Subject = $konten['judul'];
        $mail->msgHTML($konten['konten']);

        $status = [];
        for($i = 0;$i< \count($data['kepada']);$i++){
            $mail->addAddress($data['kepada'][$i]);
            //array_push($status,$data['kepada'][$i]);
            if ($mail->send()) {
                array_push($status,$data['kepada'][$i]." berhasil terkirim");
            } 
        }

        return $res->withJson(
            empty($status)?
            ['res'=>false]:['res'=>true,'data'=>$status]
        );
        
        
    }
}

```
