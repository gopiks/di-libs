/*
brownian montion
*/

if (brownian==undefined) var brownian={};

brownian.time_series=function(length, mu, sigma,start,dist,increment_period){
	 moves=random.oned.normal(length,mu*increment_period,Math.sqrt(increment_period)*sigma);
	 moves=moves.map((cummulative=> value => cummulative += value)(0));
	 if(dist=='normal'){
	 	return moves.add(start);
	 }
	 
	 if(dist=='log-normal'){
	 	return moves.exp().mult(start);
	 }
}

brownian.multi_series=function(length, means, covar,starts,dist,increment_period){
	 shape=covar.shape();
	 if(shape[0] != shape[1]) throw("Covariance has to be symmetric");
	 if(means.length!=shape[0]) throw("Number of means should be same as number of variables in covariance");
	 if(starts.length!=shape[0]) throw("Number of starting values should be same as number of variables in covariance");
	 n=shape[0];
	 
	 
	 sigma=covar.cholesky().transpose().mult(Math.sqrt(increment_period));
	 mu=means.mult(increment_period);
	 moves=random.twod.normal(length,n,0,1);
	 moves=moves.mmult(sigma).map(x=>x.add(mu));
	 zeros= starts.map(x=>0);
	 moves=moves.map((cummulative => row => (cummulative=cummulative.add(row)))(zeros));
	 if(dist=='normal'){
	 	return moves.map(x=>x.add(starts));
	 }
	 
	 if(dist=='log-normal'){
	 	return  moves.map(x=>x.exp().mult(starts));
	 	
	 }
}

if(window!=undefined)	
	window.brownian=brownian;