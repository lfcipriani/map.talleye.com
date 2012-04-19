<?
	include 'include/functionlib.php';
	require('include/php-captcha.inc.php');
	
	$EMAIL_PARA_ENVIO = "[HIDDEN]";
	
	$selectContact = array (
		"0" => "--> Select here",
	    "suggestion" => "Suggestion",
	    "complaint" => "Complaint",
	    "info" => "Information",
		"compliment" => "Compliment",
		"others" => "Others"
	);
	$selectBug = array (
		"0" => "--> Select here",
	    "simple" => "Simple bug",
		"security" => "Security bug",
		"critical" => "Critical errors",
	    "enhancement" => "Suggest an enhancement",
	    "spell" => "Spell/Grammar errors",
		"others" => "Others"
	);
	
	$enviouEmail = false;
	$prKnd = $_GET['knd'];
	$prFlag = $_POST['flag'];
	$prName = $_POST['name'];
	$prEmail = $_POST['email'];
	$prCategory = $_POST['category'];
	$prSubject = $_POST['subject'];
	$prCaptchaValue = $_POST['captchaValue'];
	
	if (isset($_POST['message'])) {
		$prMessage = $_POST['message'];
	} else {
		if (strcmp($prKnd,"bug") == 0) {
			$prMessage = "Please, answer the questions below to be more detailed in your bug
			
- What's your OS?

- What browser are you using? Which version?

- What is the type of your connection on Internet?

- What window resolution are you using?

- In what page you were when the problem occured?

- Please, describe the problem in as much details as possible:

- How can I reproduce the problem that you are having?

- There is anything more that you wanna say about the problem?

- Do you have a solution suggestion?";

		}
	}
	
	$erro = "";
	
	if (isset($prFlag)) { /* Envio de email */
	
		$prKnd = $prFlag;
	
		if (!PhpCaptcha::Validate($_POST['captchaValue'])) $erro .= "- Invalid characters on validation field. Please, certify that you are entering the correct characters.<br>";
		
		if ($prName == "") $erro .= "- The field <b>'Name'</b> is empty.<br>";
		if ($prEmail == "") $erro.= "- The field <b>'E-mail'</b> is empty.<br>";
		if ($prCategory == "0") $erro .= "- The field <b>'Category'</b> must be selected.<br>";
		if ($prSubject == "") $erro .= "- The field <b>'Subject'</b> is empty.<br>";
		if ($prMessage == "") $erro .= "- The field <b>'Message'</b> is empty.<br>";
		if (!isValidEmail($prEmail)) $erro.= "- The <b>'E-mail'</b> is invalid, please check it.<br>";
		
		if ($erro == "") {
			
			$headers = "MINE-Version: 1.0\n";
			$headers .= "Content-Type:text/plain; charset=utf-8\n";
			$headers .= "from: $prEmail\n";
			$to = $EMAIL_PARA_ENVIO;
			$subject = "[$prKnd $prCategory] $prSubject";
			$message = $prMessage;
			$message .= "\n\nData: ".date("d/m/y G:i:s", time())."\n";

			mail($to, $subject, $message, $headers);
			
			$enviouEmail = true;
		
		} else {
			$erro = "<br /><br />Please, fix the following errors on form: <br />" . $erro;
		}
	} 
	
	// deciding what site will open
	switch ($prKnd) {
		case "bug":
			$typeOfContact = "Report Bug";
			$selectArray = $selectBug;
			break;
		default:
			$typeOfContact = "Contact";
			$selectArray = $selectContact;
			$prKnd = "ctc";
			break;
	}
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
	
	<title>Tall Eye - <?=$typeOfContact ?></title>
	<!-- Titulo da pagina -->
	
	<!-- Declaracao de meta tags -->
	<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
	<meta name="author" content="Luis Felipe Cipriani"/>
	<meta name="description" content="If I walk in a straight line around the world, where will I pass?"/>
	<meta name="keywords" content="[keywords]"/>
	
	<!-- Stylesheets para as midias screen e print -->
	<style type="text/css" media="screen">@import url("stylesheets/default.css");</style>
	<link rel="stylesheet" type="text/css" href="stylesheets/default.css" title="default" media="screen" />
	<!--<link rel="stylesheet" type="text/css" href="stylesheets/print.css" media="print" />
	<link rel="alternate stylesheet" type="text/css" href="stylesheets/alternate01.css" title="alternate01" media="screen" />-->
	
	<!-- Declaracao de scripts Javascript -->
	<script type="text/javascript" src="scripts/prototype.js" ></script>
	
</head>

<body>

<a name="topo"></a>

<div id="top">
	<span>Div #top</span>
</div> <!-- #top -->

<div id="header">
	<div id="headerP1">&nbsp;</div>
	<div id="headerP2">&nbsp;</div>
	<h1>
		<img src="img/title.jpg" border="0" width="354" height="47" alt="If I walk in a straight line around the world, where will I pass?" />
	</h1>
</div> <!-- #header -->

<div id="menuBar">
	<div id="menuBarP1">&nbsp;</div>
	<div id="menuBarP2">&nbsp;</div>
	<p>
		<a href="index.php" title="Website home">home</a></a><span class="orange"> . </span>
		<a href="about.php" title="Website home">about</a><span class="orange"> . </span>
		<a href="news.php" title="Website home">news</a><span class="orange"> . </span>
		<a href="contact.php?knd=bug" title="Website home">report bug</a><span class="orange"> . </span>
		<a href="contact.php" title="Website home">contact</a>
	</p>
</div> <!-- #menuBar -->


<div id="content">

	<div id="adsenseDiv">
		<!--img src="img/200x200_text.gif" border="0"/>-->
	</div> <!-- adsenseDiv -->

	<div id="navigation">
		<h2>Our mashups!</h2>
		<p><br /><br >
		
			<a href="index.php?knd=cyd" title="CYD">
				<img src="img/cydNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/>
			</a>
			
			<br /><br >
			
			<a href="index.php?knd=cwp" title="CWP">
				<img src="img/cwpNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/>
			</a>
			
			<br /><br >
			
			<a href="bighole.php" title="CWP">
				<img src="img/digNavTitle.gif" border="0" width="195" height="40" alt="CWPimg"/>
			</a>
			
		</p>
	</div> <!-- #navigation -->

	<div id="mainContent">
	
	<? if ($enviouEmail) {
		// ENVIOU EMAIL CORRETAMENTE
	?>
		<h2><?=$typeOfContact ?></h2>
		<p>
		<br /><br />
		<b>Your email was sent succesfully! Thank you for your opinion, it's very important to us.</b>
		<br /><br />
		Use the right navigation panel to continue browsing in our mashups!
		<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
		<br /><br /><br /><br /><br /><br /><br /><br />
		</p>
	<?
	   } else {
	   // FORMULARIO
	?>
		<h2><?=$typeOfContact ?></h2>
		<p>
		<br /><br />
		Fill the form below to <?=$typeOfContact ?> (all fields are mandatory):
		
		<span class="red"><b><?= $erro?></b></span>
		
		</p>
		<form method="POST" action="contact.php" onSubmit="">
			<p><br /><br />
				Name<span class="red">*</span>:<br />
				<input type="text" name="name" value="<?=$prName ?>" maxlength="50" class="field"/><br /><br />
				
				E-mail for reply<span class="red">*</span>:<br />
				<input type="text" name="email" value="<?=$prEmail ?>" maxlength="60" class="field"/><br /><br />
				
				Category<span class="red">*</span>:<br />
				<? echo generateSelectTag("category", $selectArray, $prCategory); ?>
				<br /><br />
				
				Subject<span class="red">*</span>:<br />
				<input type="text" name="subject" value="<?=$prSubject ?>" maxlength="100" class="field"/><br /><br />
				
				Message<span class="red">*</span>:<br />
				<textarea name="message" maxlength="700" rows="15" class="field"><?=$prMessage ?></textarea>
				<br /><br />
				
				Please, fill the text field with the characters on the image below (case sensitive)<span class="red">*</span>:<br />
				<img src="visual-captcha.php" width="200" height="60" alt="Visual CAPTCHA" />&nbsp;&nbsp;
				<input type="text" name="captchaValue" value="" size="15" maxlength="15" /><br /><br />
				
				<input type="submit" value="Submit" />&nbsp;&nbsp;
				<input type="reset" value="Reset" />
				
				<input type="hidden" name="flag" value="<?=$prKnd ?>" />
			</p>
		</form>
		<? 
		} 
	?>
	</div> <!-- #mainContent -->


	<div id="nothing"></div>
</div> <!-- #content -->

<div id="footer">
	<div id="footerP1"></div>
	<div id="footerP2"></div>
	<span>&copy;2007  Tall Eye. All rights reserved.</span>
</div> <!-- #footer -->


</body>

</html>