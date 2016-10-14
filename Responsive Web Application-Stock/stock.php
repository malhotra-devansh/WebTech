<html>
 <head>
 <title>Stock Data</title>
     <STYLE type="text/css">
        table {text-align: left; background-color: #f2f2f2; margin: 0 auto; width: 650px;  border:1px solid #a6a6a6; }
        img {height: 15px; width: 15px; vertical-align: middle;}
        hr {width: 95%; color: #a6a6a6;}
        h1 {line-height: 0;}
        table#main_table {margin:0 auto; width:400px;}
        th {background-color: #e6e6e6;}
    </STYLE>
    <script>
    	function cleardisplay()
		{						
			location.href = 'stock.php';
			document.getElementById('company_name').value="";			
		}
    </script>
 </head>
 <body>
    	    
    	    
     	 <form method="POST" action="stock.php"> 
     	 <table id="main_table">     	 
         <tr><td colspan="2" align="center"><font size="6" weight="900"><i>Stock Search</i></font><hr></td></tr>
         <tr><td align="right"><b><label for="company_name">Company Name or Symbol:</label></b></td>
         <td align:"left"><input type="text" name="company_name" id="company_name"
                value="<?php echo isset($_POST["company_name"]) ? $_POST["company_name"] : "";	?>" required pattern="[ ]*[A-Za-z0-9]+[ ]*" autofocus x-moz-errormessage="Please enter valid Company Name or Symbol."></td></tr>
         <tr><td></td><td><input type="submit" name="search" value="Search">
         <input type="button" name="clear" value="Clear" onclick="cleardisplay()"></td></tr>
         <tr><td colspan ="2" align="center"><b><a href="http://www.markit.com/product/markit-on-demand" target="_blank">Powered by Markit on Demand</a></b></td></tr>
         <tr height="20"></tr>         
         </table>
         </form>  
        
         <br>  	
	 
    <?php if(isset($_POST["search"]))
	{	
		$link_to_website = "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/xml?input=";
		$company_name = trim($_POST["company_name"]," ");
		$api_url = $link_to_website.$company_name;
		$response = file_get_contents($api_url);
		$LookUpResultList = new SimpleXMLElement($response);		
	
		$num_of_children = 	count($LookUpResultList);
		echo "<table border='1' style='border-collapse: collapse'>";
		
			if($num_of_children == 0)
				echo "<tr><td align='center'>No Records have been found</td></tr>";
			else
			{		
				
				echo "<tr>";
				echo "<th>Name</th>" ;
				echo "<th>Symbol</th>" ;
				echo "<th>Exchange</th>" ;
				echo "<th>Details</th>" ;
				echo "</tr>";
				
				for( $i = 0 ; $i < $num_of_children; $i++)
				{
					echo "<tr>";
					
					echo "<td>".$LookUpResultList->LookupResult[$i]->Name."</td>" ;
					echo "<td>".$LookUpResultList->LookupResult[$i]->Symbol."</td>" ;
					echo "<td>".$LookUpResultList->LookupResult[$i]->Exchange."</td>" ;
					echo "<td><a href='stock.php?symbol=".$LookUpResultList->LookupResult[$i]->Symbol."&textval=".$company_name."'>More info</a></td>"  ;
					echo "</tr>";
				}	
			}
		echo "</table>";
		}	
	 ?>	
	
	<script> 
	function load_company_field()
	{
		 var name = document.getElementById('company_name');
		 name.value = "<?php echo $_GET['textval']; ?>";
		 
	}
	</script>
	
	<?php if(isset($_GET["symbol"]))
	{
		date_default_timezone_set('America/Los_Angeles');
		echo "<script> load_company_field(); </script>"; 
		$link_to_service = "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=";
		$company_symbol = $_GET["symbol"];
		$service_url = $link_to_service.$company_symbol;
		$json_response = file_get_contents($service_url);
		$ResultSet = json_decode($json_response);
		
		$breakout = false;
		echo "<table border='1' style='border-collapse: collapse'>";
		foreach($ResultSet as $key => $value) 
		{
			if($breakout === true)
				break;
			switch ($key) 
			{
				case 'Message': echo "<tr>";
				        		echo "<td align='center'><i>There is no stock information available<i></td>";
								echo "</tr>";
								$breakout = true;
								break;	 
								
				case 'Status':  $error = substr($value, 0, 7);
								if ($error === "Failure")
								//if ($value === "Failure|APP_SPECIFIC_ERROR") 
						        {
					        		echo "<tr>";
					        		echo "<td align='center'><i>There is no stock information available<i></td>";
									echo "</tr>";
									$breakout = true;
									break;	                
						        }
								else 
								{
									break;
								}
								
				case 'Name': echo "<tr>";
							 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
							 echo "<td align='center'>".$value."</td>";
							 echo "</tr>";
							 break;
							 
				case 'Symbol':   echo "<tr>";
								 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
								 echo "<td align='center'>".$value."</td>";
								 echo "</tr>";
								 break;
								 
				case 'LastPrice':    $lastprice = $value;
									 echo "<tr>";
									 echo "<td style='background-color: #e6e6e6'><b>"."Last Price"."<b></td>";
									 echo "<td align='center'>".$lastprice."</td>";
									 echo "</tr>";
									 break;
									 
				case 'Change':   echo "<tr>";
								 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
								 
								 if($value == 0)
								 	echo "<td align='center'>".round($value, 2)."</td>";
								 else if($value > 0)
								 	echo "<td align='center'>".round($value, 2)." <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td>";
								 else
								 	echo "<td align='center'>".round($value, 2)." <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td>";
								 
								 echo "</tr>";
								 break;
								 
				case 'ChangePercent': 	 echo "<tr>";
										 echo "<td style='background-color: #e6e6e6'><b>"."Change Percent"."<b></td>";
										
										 if($value == 0)
								 			echo "<td align='center'>".round($value, 2)."</td>";
										 else if($value > 0)
										 	echo "<td align='center'>".round($value, 2)."% <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td>";
										 else
											echo "<td align='center'>".round($value, 2)."% <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td>";
										  
										 echo "</tr>";
										 break;
										 
				case 'Timestamp': 	 $dateval = strtotime($value);	 
									 $datedisplay = date("Y-m-d h:i A", $dateval);
									 echo "<tr>";
									 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
									 echo "<td align='center'>".$datedisplay."</td>";
									 echo "</tr>";
									 break;
									 
				case 'MSDate': break;
				
				case 'MarketCap': $marketcap = ($value/1000000000);								  
								  echo "<tr>";
								  echo "<td style='background-color: #e6e6e6'><b>"."Market Cap"."<b></td>";
								  
								  $valueinmillion = ($marketcap * 1000);
								  if($valueinmillion < 10)
								  {
								  	echo "<td align='center'>".round($valueinmillion, 2)." M</td>";
								  }
								  else
							  	  {
							 	    echo "<td align='center'>".round($marketcap, 2)." B</td>"; 
								  }
							
								  echo "</tr>";
								  break;
								  
				case 'Volume':	 echo "<tr>";
								 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
								 echo "<td align='center'>".number_format($value, 0,'',',')."</td>";
								 echo "</tr>";
								 break;
									 
				case 'ChangeYTD':    $changeYTD = $lastprice - $value ;
									 echo "<tr>";
									 echo "<td style='background-color: #e6e6e6'><b>"."Change YTD"."<b></td>";
									 
									 if($changeYTD == 0)
								 		echo "<td align='center'>".round($changeYTD, 2)."</td>";
									 else if($changeYTD < 0)
									 	echo "<td align='center'>(".round($changeYTD, 2).") <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td>";
									 else
										echo "<td align='center'>".round($changeYTD, 2)." <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td>"; 
						
									 echo "</tr>";
									 break;
				
				case 'ChangePercentYTD': echo "<tr>";
										 echo "<td style='background-color: #e6e6e6'><b>"."Change Percent YTD"."<b></td>";
										 
										 if($value == 0)
								 			echo "<td align='center'>".round($value, 2)."</td>";
										 else if($value > 0)
										 	echo "<td align='center'>".round($value, 2)."% <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Green_Arrow_Up.png'></td>";
										 else
										 	echo "<td align='center'>".round($value, 2)."% <img src='http://cs-server.usc.edu:45678/hw/hw6/images/Red_Arrow_Down.png'></td>";
										 
										 echo "</tr>";
										 break;
				
				case 'High': echo "<tr>";
							 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
							 echo "<td align='center'>".$value."</td>";
							 echo "</tr>";
							 break;
									 
				case 'Low':  echo "<tr>";
							 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
							 echo "<td align='center'>".$value."</td>";
							 echo "</tr>";
							 break;
							 
				case 'Open': echo "<tr>";
							 echo "<td style='background-color: #e6e6e6'><b>".$key."<b></td>";
							 echo "<td align='center'>".$value."</td>";
							 echo "</tr>";
							 break;
							 
				default: break;
			}
	
		}
	echo "</table>";		
	}
	?>
	
 </body>
 </html>
 