const serviceStatusUpdate = (service, newStatus, date, startTime, endTime) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Service Status Update</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<a href=""><img class="logo"
					src="https://i.ibb.co/gjXpzwJ/S.png" alt="Smart-Hub Logo"></a>
			<div class="message">Service Status Update</div>
			<div class="body">
				<p>Dear User,</p>
				<p>We wanted to inform you that the status of your service <span class="highlight">${service.name}</span> has been updated. The current status is:</p>
				<h2 class="highlight">${newStatus}</h2>
				<p><strong>Date:</strong> ${date}</p>
				<p><strong>Time Slot:</strong> ${startTime} - ${endTime}</p>
				<p>Please take any necessary actions based on this status update. If you did not make this change, or if you have any concerns, feel free to contact us.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:smarthub.info8@gmail.com">smarthub.info8@gmail.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = serviceStatusUpdate;
