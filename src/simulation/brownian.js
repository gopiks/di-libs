/*
brownian montion
*/

if (brownian==undefined) var brownian={};

brownian.time_series=function(length, mu, sigma,start,dist,increment_period){
	 moves=random.normal.oned(length,mu*increment_period,Math.sqrt(increment_period)*sigma);
	 if(dist=='normal'){
	 	return moves.map((sum => value => sum += value)(start));
	 }
	 if(dist=='normal'){
	 	return moves.map((sum => value => sum += value)(start));
	 }
	 if(dist=='log-normal'){
	 	return moves.map((sum => value => sum += value)(0)).map(x=>Math.exp(x)*start);
	 }
}

if(window!=undefined)	
	window.brownian=brownian;