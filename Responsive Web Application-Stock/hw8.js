window.onload = createFavoriteTable();

//window.onload=cleanup();
// Used temporarily to clear out local storage
/*function cleanup()  
{
	localStorage.removeItem('mVal');
	console.log(localStorage.length);
	for (var i=-1; i<localStorage.length; i++)
	{
		localStorage.removeItem('storageNames['+i+']');
		console.log(localStorage);
	}
}*/

/* To activate the carousel */
$(document).ready(function(){
	$("#carouselpart").carousel({
	  interval: false					// Disable auto-play
	});
});

/* SLIDE ON CLICK */ 

$(".carousel-linked-nav > li > a").click(function() {
	
	//alert("Inside navigator");
    // grab href, remove pound sign, convert to number
    var item = Number($(this).attr('href').substring(1));

    // slide to number -1 (account for zero indexing)
    $('#carouselpart').carousel(item - 1);

    // remove current active class
    $('.carousel-linked-nav .active').removeClass('active');

    // add active class to just clicked on item
    $(this).parent().addClass('active');

    // don't follow the link
    return false;
});

function jqUpdateSize(){
    //alert("Checking device width");
    var width = $(window).width();
    if (width < 400 )
    {
    	$("#desktop").css('display','none');
    	$("#mobile").css('display','block');
    	
    	$("#refDesktop").css('display','none');
    	$("#refMobile").css('display','block');
    }
    else
    {
    	$("#mobile").css('display','none');
    	$("#desktop").css('display','block');
    	
	 	$("#refMobile").css('display','none');
    	$("#refDesktop").css('display','block');
    }
};
$(document).ready(jqUpdateSize);
$(window).resize(jqUpdateSize); 

/* Functioning for Auto-Complete */  
$(document).ready(function(){
	$("#searchVal")
	.focus()
	.autocomplete({
	source: function(request,response){
			if($("#searchVal").val().length > 0)
			$.ajax({
				url: "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=" + $("#searchVal").val() ,
				dataType: "jsonp",				
				success: function(data){
					response( $.map(data, function(record){
						return{
							label: record.Symbol + " - " + record.Name + " ( " + record.Exchange + " )",
							value: record.Symbol                                          	
						}                                        
					}));					
				}
			});
		},
	});
});     

/* Validates all the fields in the form */
  $("#searchForm").validate({
          
      showErrors: function(errorMap, errorList) {
          // Clean up any tooltips for valid elements
          $.each(this.validElements(), function (index, element) {
              var $element = $(element);
              $element.data("title", "") // Clear the title - there is no error associated anymore
                  .removeClass("error")
                  .tooltip("destroy");
          });
          // Create new tooltips for invalid elements
          $.each(errorList, function (index, error) {
              var $element = $(error.element);
              $element.tooltip("destroy") // Destroy any pre-existing tooltip so we can repopulate with new tooltip content
                  .data("title", error.message)
                  .addClass("error")                
                  .tooltip(); // Create a new tooltip based on the error messsage we just set in the title
          });
      },
      submitHandler: function(form) {
          //alert("This is a valid form!");
      }
  });
/*$(document).ready(function()
{
	$("#searchForm").validate({
	rules: {
		searchVal : "required"
	},
	messages : {
		searchVal : "Please enter the company name or symbol"
	},
	errorElement: "span",
    errorPlacement: function ( error, element ) {
            //error.addClass( "help-block" );
            //error.insertAfter( element );
            error.addClass( "tooltiptext" );
    },
    highlight: function ( element, errorClass, validClass ) {
            $( element ).parents( ".form-group" ).addClass( "has-error" ).removeClass( "has-success" );
    },
    unhighlight: function (element, errorClass, validClass) {
            $( element ).parents( ".form-group" ).addClass( "has-success" ).removeClass( "has-error" );
    },
    submitHandler: function(form) {
	//$("#searchform").submit();
    },
    invalidHandler: function() {
    }
	});
});*/

/*This function load the data into the table*/
function loadTable(form)
{
	$("#nextSection").prop('disabled', false);
	if( $("#searchForm").valid() )
	{
		//alert("Inside success condition");
		
		$.ajax({
		url: "http://homework8.sdqpqmist9.us-west-2.elasticbeanstalk.com/",  // AWS environment link
		dataType: "json",
		data:{
			symbol: $("#searchVal").val()
		},
		crossDomain: true,
		success: function(output)
		{	
			// Checks the message to see if the symbol passed was valid or not
			if(output.Message)
			{
				$("#nextSection").prop('disabled', true);
				$("#errorMessage").html("Select a valid entry").css('color','Red');
				$("#stockName").html("-");
				$("#stockSymbol").html("-");
				$("#lastPrice").html("-");
				$("#changePercent").html("-");
				$("#dateTime").html("-");
				$("#marketCap").html("-");
				$("#volume").html("-");
				$("#changeYTD").html("-");
				$("#highPrice").html("-");
				$("#lowPrice").html("-");
				$("#openPrice").html("-");
			}
			// Assigns the values obtained through the service
			else
			{	
				// Shifting to the next slide in carousel
				$("#carouselpart").carousel(1);
				$("#1").removeClass('active');
				$("#2").addClass('active');
			  
				
				$("#errorMessage").html("");
				
				$("#stockName").html(output.Name);		
				
				$("#stockSymbol").html(output.Symbol);
				
				// Last Price
				var lp = output.LastPrice;				
				var lpround = Math.round(lp*100)/100;
				var lastPrice = lpround.toFixed(2);
				$("#lastPrice").html("$ "+lastPrice);
				
				// Change and Change Percent								
				var change = output.Change;			
				var finalCh = Math.round(change*100)/100;
				var finalChange = finalCh.toFixed(2);
				
				var changePercent = output.ChangePercent;
				var finalChangePer = Math.round(changePercent*100)/100;
				var finalChangePercent = finalChangePer.toFixed(2);
				
				if(finalChangePer < 0)
						{$("#changePercent").html(finalChange +" ("+finalChangePercent+"%) "+"<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/down.png' height=15px width=15px vertical-align=middle></img>").css("color", "red");}
				if(finalChangePer >= 0)
						{$("#changePercent").html(finalChange +" ("+finalChangePercent+"%) "+"<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/up.png' height=15px width=15px vertical-align=middle></img>").css("color","green");}					
					
				// Date and Time
				/*var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];		
				var d = new Date(output.Timestamp);
				var month = d.getMonth();
				var day = d.getDate();
				var hours = d.getHours()+1;    
				var minutes = d.getMinutes();
				var seconds = d.getSeconds();
				var correctDate = "";
				var correctHours = "";
				var correctMinutes = "";
				var correctSeconds = "";
				var ampm = "";
				
				if( day < 10)
					correctDate = "0" + day;
				else
					correctDate = day;
					
				if(hours > 12)
				{
					hours = hours - 12;
					ampm = "pm";
				}
				else
				{
					ampm = "am";
				}
				if(hours <10)
					correctHours = "0" + hours;
				else
					correctHours = hours;
				
				if( minutes < 10)
					correctMinutes = "0" + minutes;
				else
					correctMinutes = minutes;
					
				if( seconds < 10)
					correctSeconds = "0" + seconds;
				else
					correctSeconds = seconds;
				
				var outputDate = correctDate + " " + monthNames[month] + " " + d.getFullYear() + " " + correctHours + ":" + correctMinutes + ":" + correctSeconds + " " + ampm;	
				$("#dateTime").html(outputDate);*/
				var d = output.Timestamp;                               
                $("#dateTime").html( moment(d).format('D MMMM YYYY, h:mm:ss a'));
			
				// Market Cap
				var marketcap= output.MarketCap;
				var divide= (marketcap/1000000000);				
				var marketcap1round = Math.round(divide*100)/100;
				var marketmillion= marketcap1round*1000;			
				if(marketmillion < 10)
				{
					var marketmillion1 = Math.round(marketmillion*100)/100;
					var marketmillion1Final = marketmillion1.toFixed(2);
					$("#marketCap").html(marketmillion1Final+" Million");
				}
				if(marketmillion > 10)
				{
					var marketcap1roundFinal = marketcap1round.toFixed(2);
					$("#marketCap").html(marketcap1roundFinal+" Billion");	
				}
				else
				{
					var marketmillionFinal = marketmillion.toFixed(2);
					$("#marketCap").html(marketmillionFinal);
				}			
				
				// Volume
				$("#volume").html(output.Volume);
				
				// Change YTD and Change Percent YTD
				var changeYTD = output.ChangeYTD;
				var changeYTDFin = Math.round(changeYTD*100)/100;
				var changeYTDFinal = changeYTDFin.toFixed(2);
				
				var changeper = output.ChangePercentYTD;
				var changePercentYTDFin = Math.round(changeper*100)/100;
				var changePercentYTDFinal = changePercentYTDFin.toFixed(2);
				if(changePercentYTDFin < 0)
					
						{$("#changeYTD").html(changeYTDFinal+" ("+changePercentYTDFinal+"%) "+"<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/down.png' height=15px width=15px vertical-align=middle></img>").css("color", "red");}
					
				else
					
						{$("#changeYTD").html(changeYTDFinal+" ("+changePercentYTDFinal+"%) "+"<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/up.png' height=15px width=15px vertical-align=middle></img>").css("color", "green");}
					
				// High Price
				var highPrice = output.High;
				var highPriceFin = Math.round(highPrice*100)/100;
				var highPriceFinal = highPriceFin.toFixed(2);
				$("#highPrice").html("$ "+highPriceFinal);
				
				// Low Price
				var lowPrice = output.Low;
				var lowPriceFin = Math.round(lowPrice*100)/100; 
				var lowPriceFinal = lowPriceFin.toFixed(2);
				$("#lowPrice").html("$ "+lowPriceFinal);
				
				// Open Price
				var openPrice= output.Open;
				var openPriceFin = Math.round(openPrice*100)/100;
				var openPriceFinal = openPriceFin.toFixed(2);
				$("#openPrice").html("$ "+openPriceFinal);

				$("#fbShare").click(function(e){
				e.preventDefault();
					FB.ui(
					  {
						method: 'share',
						href: 'http://cs-server.usc.edu:11231/hw8.html',
						title: 'Current Stock Price of '+output.Name+' is $'+lastPrice,
						description: 'Stock Information of '+ output.Name + ' (' + output.Symbol + ')',
						caption: 'LAST TRADE PRICE: ' + '$' + lastPrice + ', CHANGE: ' + finalChange + '(' + finalChangePercent + '%)' ,
						picture: "http://chart.finance.yahoo.com/t?s=" + $("#searchVal").val() + "&lang=en-US&width=520&height=380",
					  },
					  // callback
					  function(response) {
						if (response && !response.error_message) {
						  alert('Posting completed.');
						} 
						else {
						  alert('Error while posting.');
						}
					  }
					);
				});
				var company = $("#searchVal").val();
				new Markit.InteractiveChartApi(company,1095);			
			}
		}
		});
	  
		/* Displaying chart for current stock */
		var linkToImage = "<img src='http://chart.finance.yahoo.com/t?s=" + $("#searchVal").val() + "&lang=en-US&width=520&height=380' style='width:520px;height:380px'/>";
		$("#staticChart").html(linkToImage);
		
		/* Handling NEWS feed */  
		$.ajax({
			url: "https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27"+$("#searchVal").val()+"%27&$format=json",
			dataType: "json",
			method: 'POST',
			headers:{
				'Authorization': 'Basic OkJWTW9kbUloMWNhanZDYk1zTkJ6a2RGSk03c3FkL0haZ3VRQ0lEb3Robmc='
			},
			success: function(data){		
			if(data){
				var feedDisplay="";
				var numberOfFeeds= data.d.results.length;
				var searchKey = $("#searchVal").val();
				for(var i=0; i < numberOfFeeds; i++)
				{
					var re = new RegExp(searchKey, 'g');
					var feedLink = data.d.results[i].Url;
					var feedTitle = data.d.results[i].Title;
					var feedContent = data.d.results[i].Description;
					var feedPublisher = data.d.results[i].Source;
					var feedDate = data.d.results[i].Date;		
					var feedContent = feedContent.replace(re, searchKey.bold());
					feedDisplay += "<div class='well text-left'><a href='" + feedLink + "'>";
					feedDisplay += feedTitle + "</a><p>" + feedContent + "<p><br><b>Publisher: " + feedPublisher + "<p>Date: " + feedDate + "</b></div><p>";		
				}		
				$("#newsFeed").html(feedDisplay);
			}
		}
		});
		
			var flag=0;    
           //var value=$("#searchVal").val();
           //var value1='"$value"';
           var str1= $("#searchVal").val();
           str1=str1.toUpperCase();
           console.log("start");
           for (key in localStorage)
           {
                if(key)
                {
                     console.log(localStorage + "====" + key + "====" + localStorage.getItem(key));
                     var chk = localStorage.getItem(key);
                    
                     if(chk)
                     {
                           var len = (chk.length)-1;
                           var str = chk.substring(1,len);
                           str=str.toUpperCase();
                           if (str === str1)
                           {
                                //console.log(key + ' - ');
                                //alert(key);
                                var but = "<button class='btn btn-custom' id='yellowStar' onclick='saveFavoriteAgain(\""+key+"\")'> <span class='glyphicon glyphicon-star' aria-hidden='true' style='color:yellow'></span> </button>"
                                $("#empty").html(but);
                                flag=1;
                                break;
                           }
                     }
                }
           }
           //console.log("--" + flag + "--");
           if(flag == 0)
           {
                //console.log("inside");
                $("#empty").html("<button class='btn btn-custom' onclick='change()'> <span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span> </button>");   
           }
	}
}
/* Clearing search field */ 
function clearForm(form)
{ 
	window.location.reload();
	$("#nextSection").prop('disabled',true);
}

/* Refresh functionality */

/*function refreshFavoriteTable()
{
    $("#favorites").empty();
    if(localStorage.storedTable)
    {             
        var storedArrayObject= localStorage.getItem("aLabel");
        var storedArray= $.parseJSON(storedArrayObject);
        for(i=0;i<storedArray.length; i++)
        {
                        storedSymbol=storedArray[i];
                        createFavoriteTable(storedSymbol);
       
        }
    }
}

function autoRefresh($("#autoRefresh"))
{	
	if($("#autoRefresh").checked)
	{reloading=setTimeout("createFavoriteTable();",5000);}
	else
	clearTimeout(reloading);
}

function autoRefreshFavoriteTable(){
	if (document.getElementById('autoRefresh').checked){
		ref = setTimeout("refresh();", 5000);
	} 
	else{
		clearTimeout(ref);
	}
}*/
$("#refresh").click(function(){
	//alert("clicked");
	createFavoriteTable();            
});
function refresh(){
	//alert("refresh clicked");
	createFavoriteTable();            
}

function autoref(){
    if (document.getElementById('autoRefresh').checked) 
    {    
	    	//alert("auto refresh clicked");
	        ref = setInterval("refresh()", 10000);        
    } 
    else 
    {
        clearTimeout(ref);
    }
}

/* Tool Tip */
$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip(); 
});

/* Historic Chart */
var Markit = {};
			
Markit.InteractiveChartApi = function(symbol,duration){
	this.symbol = symbol.toUpperCase();
	this.duration = duration;
	this.PlotChart();
};
			
Markit.InteractiveChartApi.prototype.PlotChart = function(){
	
	var params = {
		parameters: JSON.stringify( this.getInputParams() )
	}

	$.ajax({
		beforeSend:function(){
			$("#historicalChart").text("Loading chart...");
		},
		data: params,
		url: "http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp",
		dataType: "jsonp",
		context: this,
		success: function(json){
			//Catch errors
			if (!json || json.Message){
				//console.error("Error: ", json.Message);
				return;
			}
			this.render(json);
		},
		error: function(response,txtStatus){
			//console.log(response,txtStatus)
		}
	});
};

Markit.InteractiveChartApi.prototype.getInputParams = function(){
	return {  
		Normalized: false,
		NumberOfDays: this.duration,
		DataPeriod: "Day",
		Elements: [
		{
			Symbol: this.symbol,
			Type: "price",
			Params: ["ohlc"] //ohlc, c = close only
		},
		{
			Symbol: this.symbol,
			Type: "volume"
		}
		]
	}
};

Markit.InteractiveChartApi.prototype._fixDate = function(dateIn) {
	var dat = new Date(dateIn);
	return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
};

Markit.InteractiveChartApi.prototype._getOHLC = function(json) {
	var dates = json.Dates || [];
	var elements = json.Elements || [];
	var chartSeries = [];
	
	if (elements[0]){
		
		for (var i = 0, datLen = dates.length; i < datLen; i++) {
			var dat = this._fixDate( dates[i] );
			var pointData = [
			dat,
			elements[0].DataSeries['open'].values[i],
			elements[0].DataSeries['high'].values[i],
			elements[0].DataSeries['low'].values[i],
			elements[0].DataSeries['close'].values[i]
			];
			chartSeries.push( pointData );
		};
	}
	return chartSeries;
};
			
Markit.InteractiveChartApi.prototype._getVolume = function(json) {
	var dates = json.Dates || [];
	var elements = json.Elements || [];
	var chartSeries = [];
	
	if (elements[1]){
		
		for (var i = 0, datLen = dates.length; i < datLen; i++) {
			var dat = this._fixDate( dates[i] );
			var pointData = [
			dat,
			elements[1].DataSeries['volume'].values[i]
			];
			chartSeries.push( pointData );
		};
	}
	return chartSeries;
};
			
Markit.InteractiveChartApi.prototype.render = function(data) {
	//console.log(data)
	// split the data set into ohlc and volume
	var ohlc = this._getOHLC(data),
	volume = this._getVolume(data);
	
	// set the allowed units for data grouping
	var groupingUnits = [[
	'week',                         // unit name
	[1]                             // allowed multiples
	], [
	'month',
	[1, 2, 3, 4, 6]
	]];
	
	// create the chart
	$('#historicalChart').highcharts('StockChart', {
		
		//disable exporting
		exporting: {
			enabled: false
		},
		
		
		rangeSelector: {
			selected: 1
			//enabled: false
		},
		
		title: {
			text: this.symbol + ' Historical Price'
		},
		yAxis: {
			title: {
				enabled: true,
				text: 'Stock Value',
				style: {
					fontWeight: 'normal'
				}
			}
		},
		series: [{
			type: 'area',
			name: this.symbol,
			threshold: null,
			data: ohlc,
			dataGrouping: {
				units: groupingUnits
			},
			fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
				[0, Highcharts.getOptions().colors[0]],
				[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
				]
			}
		}],
		
		
		credits: {
			enabled:false
		},
		tooltip: {
			formatter: function () {
				var s = Highcharts.dateFormat('%A, %b %d, %Y', this.x);
				
				$.each(this.points, function (i, point) {
					s += '<br/>' + point.series.name + ': <b>$' + point.y + '</b>';
				});
				
				return s;
			}, shared: true
		},
		
		
		title : {
			text : $("#searchVal").val() + ' Stock Value'
			
		},
		
		rangeSelector : {
			allButtonsEnabled: true,
			buttons: [
			{
				type: 'week',
				count: 1,
				text: '1w',
			},
			{
				type: 'month',
				count: 1,
				text: '1m',
			},
			{
				type: 'month',
				count: 3,
				text: '3m',
			},
			{
				type: 'month',
				count: 6,
				text: '6m',
			}, 
			{
				type: 'ytd',
				count: 1,
				text: 'YTD',
				
			}, 
			{
				type: 'year',
				count: 1,
				text: '1y',
				
			}, 
			{
				type: 'all',
				text: 'All',
				
			}
			],
			
			selected: 0,
			inputEnabled:false
			
		},
	});
};
			
/* Save favourite again */
function saveFavoriteAgain(name)
{
	//alert("---"+name);
	var myarr = name.split("[");
	var finalarr = myarr[1].split("]");
	//alert(finalarr[0]);
	$("#empty").html("<button class='btn btn-custom' onclick='change()'> <span class='glyphicon glyphicon-star-empty' aria-hidden='true'></span> </button>");
	deletefav(finalarr[0]);
}			
/* Delete entries from Favorite Table*/
function deletefav(symbolname)
{
	//alert(symbolname);
	//console.log(symbolname);
	//console.log(localStorage);
	localStorage.removeItem('localStorageEntries['+symbolname+']');
	//console.log(localStorage);
	//createFavoriteTable();
	document.getElementById('row'+symbolname).style.display = "none";
}  

/* Favorite button functioning */
function change(){
	$("#empty").html( "<button class='btn btn-custom' id='but'><span class='glyphicon glyphicon-star' aria-hidden='true' style='color:yellow'></span></button>");
	$("#nextSection").prop('disabled', false);
	var symbol=$("#searchVal").val();
	
	var a = -1;
	// Checking if the value for index is already there in the local storage
	if(localStorage.getItem("aLabel"))
		a = localStorage.getItem("aLabel");
	
	a++;
	localStorage.setItem("aLabel",a);
	
	storeNameOfStock(symbol,a);
	createFavoriteTable();
} 


/*   -------------  Functions for favorite table functionality----------------------  */
function favoriteStockValue(name)
{
	//alert(name);
	$("#searchVal").val(name);
	loadTable();
	//$("#empty").html( "<button class='btn btn-custom' id='but'> <span class='glyphicon glyphicon-star' aria-hidden='true' style='color:yellow'></span> </button>");
}

/* Strong Stocks in Local Storage */
localStorageEntries=[];
	
function storeNameOfStock(symbol,a)
{	
	localStorage.setItem("localStorageEntries[" + a + "]", JSON.stringify(symbol));
}

/* Creating Favorite Table */
function createFavoriteTable()
{ 
	var a = localStorage.getItem("aLabel");
	if(localStorage)
	{	
		$("#favorites").html('');
		for(var i=0; i <= a; i++)
		{
			var label = "localStorageEntries[" + i + "]";
			var stock = localStorage.getItem(label);

			if(!stock)
			   continue;

			var namee= JSON.parse(stock);

			$.ajax({
			url: "http://homework8.sdqpqmist9.us-west-2.elasticbeanstalk.com/",  // AWS environment link
			async: false,
			dataType: "json",
			data:{
			symbol: namee
			},
			crossDomain: true,
			success: function(output)
			{	
				content="<tr id='row" + i + "'><td align='left'><a href='#carouselpart'  data-slide-to='1' onclick='favoriteStockValue("+ '"'+output.Symbol+'"' +"); return false;'>"+output.Symbol+"</a></td><td align='left'>";
			  			
				// Last Price
				var lp = output.LastPrice;				
				var lpround = Math.round(lp*100)/100;
				var lastPrice = lpround.toFixed(2);
				
				//content = "<tr id='row" + i + "'><td align='left'><a href='javascript:favoriteStockValue(" + output.Symbol + ")'>" + output.Symbol + "</a></td><td align='left'>";
				content += output.Name + "</td><td align='left'>$ " + lastPrice + "</td>";
				
				// Change YTD and Change Percent YTD
				var changeYTD = output.ChangeYTD;
				var changeYTDFin = Math.round(changeYTD*100)/100;
				var changeYTDFinal = changeYTDFin.toFixed(2);
				
				var changeper = output.ChangePercentYTD;
				var changePercentYTDFin = Math.round(changeper*100)/100;
				var changePercentYTDFinal = changePercentYTDFin.toFixed(2);
				
				if(changePercentYTDFin < 0)
				{ 	
					var favoriteChange = changeYTDFinal + " (" + changePercentYTDFinal + "%) " + "<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/down.png' height=15px width=15px vertical-align=middle></img>";
					content += "<td align='left'><font color='red'><span class='hidden-xs'>" + favoriteChange + "</span></style></td><td align='left'><span class='hidden-xs'>";
				}					
				else
				{
					var favoriteChange = changeYTDFinal + " (" + changePercentYTDFinal + "%) " + "<img src ='http://cs-server.usc.edu:45678/hw/hw8/images/up.png' height=15px width=15px vertical-align=middle></img>";
					content += "<td align='left'><font color='green'><span class='hidden-xs'>" + favoriteChange + "</span></style></td><td align='left'><span class='hidden-xs'>";
				}

				// Market Cap
				var marketcap= output.MarketCap;
				var divide= (marketcap/1000000000);				
				var marketcap1round = Math.round(divide*100)/100;
				var marketmillion= marketcap1round*1000;			
				if(marketmillion < 10)
				{
					var marketmillion1 = Math.round(marketmillion*100)/100;
					var marketmillion1Final = marketmillion1.toFixed(2);
					var marketCapMillionHtml = marketmillion1Final + " Million</span></td>";
					content += marketCapMillionHtml;
				}
				if(marketmillion > 10)
				{
					var marketcap1roundFinal = marketcap1round.toFixed(2);
					var marketCapInBillionHtml= marketcap1roundFinal + " Billion</span></td>";	
					content += marketCapInBillionHtml;
				}
				else
				{
					var marketmillionFinal = marketmillion.toFixed(2);
					content += marketmillionFinal + "</td>" ;
				}

				content += "<td align='left'><span class='hidden-xs'><button class='btn btn-custom' onClick='deletefav(" + i + ")' class='but'> <span class='glyphicon glyphicon-trash' aria-hidden='true' onClick='deletefav(" + i + ")' ></span> </button></span></td></tr>";
				
				document.getElementById('favorites').innerHTML += content;
			}
			});
		}
	}
}
