greedy_app.controller('greedyController',function($scope,$http){
	$scope.fromDate = new Date();
  	$scope.fromDate.setDate($scope.fromDate.getDate() -1)
  	$scope.toDate = new Date();
  	$scope.today = new Date();
  	$scope.maxDate = new Date(
	    $scope.today.getFullYear(),
	    $scope.today.getMonth(),
	    $scope.today.getDate() -1
	    );
  	$scope.dateError = false;
  	$scope.isLoading=false;

  	$scope.labels=[];
  	$scope.barData=[];
  	$scope.myData = {
    labels: $scope.labels ,
    datasets: [{
        type: 'bar',
        label: 'Ad Requests',
        backgroundColor: "#8BC34A",
        data: $scope.barData,
        yAxisID:"y-axis-1"
    	}],
	};

  	$scope.$watch('fromDate',function(newValue,oldValue){
  		if(newValue != oldValue)
  		{
  			$scope.checkError()
  		};
  	});

  	$scope.$watch('toDate',function(newValue,oldValue){
  		if(newValue != oldValue)
  		{
  			$scope.checkError()
  		};
  	});

  	$scope.checkError = function()
  	{
  		if($scope.fromDate >= $scope.toDate)
		{
			$scope.dateError=true;
		}
		else
		{
			$scope.dateError=false;
		};
  	}

  	$scope.getData = function()
  	{
  		$scope.isLoading=true;
  		var seed = $http({
  			method:'GET',
  			url:"http://104.197.128.152/data/adrequests?from="+moment($scope.fromDate).format('YYYY-MM-DD')+"&to="+moment($scope.toDate).format('YYYY-MM-DD'),
  			headers:{'Content-Type':'application/x-www-form-urlencoded'}
  		});
  		seed.success(function(response){
  			$scope.isLoading=false;
  			while($scope.barData.length>0)
  			{
  				$scope.labels.pop();
  				$scope.barData.pop();
  			}
  			for(var i=0;i<response.data.length;i++)
  			{
  				$scope.labels.push(response.data[i].date)
  				$scope.barData.push(response.data[i].adrequest)
  			}

  			var ctx = document.getElementById("canvas").getContext("2d");
        	window.myMixedChart = new Chart(ctx, {
            type: 'bar',
            data: $scope.myData,
            options: {
                responsive: true,
                title: {
                    display: false,
                    text: 'Day Wise'
                },
                tooltips: {
                    mode: 'index',
                    intersect: true,
                    callbacks: {
                        label: function(tooltipItems, data)
                        { 
                            return data.datasets[tooltipItems.datasetIndex].label + ": " + tooltipItems.yLabel;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        id:"xAxis",
                        scaleLabel: {
                            display: true,
                            labelString: "Date"
                        },
                    }],
                    yAxes: [{
                            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: "left",
                            id: "y-axis-1",
                            scaleLabel: {
                                display: true,
                                labelString: "No. of Ad Requests"
                            },

                        }],
                    }
                }
            });
  		});
  		seed.error(function(data){
  			$scope.isLoading=false;
  		});

  	};
});