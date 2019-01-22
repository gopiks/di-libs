function call_price(S,K,r,v,t) { 
  var sqt = Math.sqrt(t);
  d1 = (Math.log(S/K) + r*t)/(v*sqt) + 0.5*(v*sqt);
  d2 = d1 - (v*sqt);
  delta = normalcdf(d1);
  Nd2 = normalcdf(d2);
  ert = Math.exp(-r*t);
  nd1 = ndist(d1);
  result={}
  result['price']=S*delta-K*ert *Nd2;
  result['gamma'] = nd1/(S*v*sqt);
  result['vega'] = S*sqt*nd1;
  result['theta'] = -(S*v*nd1)/(2*sqt) - r*K*ert*Nd2;
  result['rho'] = K*t*ert*Nd2;
  return (result );
} //end of black_scholes call

function put_price(S,K,r,v,t) { 
  var sqt = Math.sqrt(t);
  d1 = (Math.log(S/K) + r*t)/(v*sqt) + 0.5*(v*sqt);
  d2 = d1 - (v*sqt); 
  delta = normalcdf(d1)-1;
  Nd2 = -normalcdf(-d2); 
  ert = Math.exp(-r*t);
  nd1 = ndist(d1);
  result={}
  result['price']=S*delta-K*ert *Nd2;
  result['gamma'] = nd1/(S*v*sqt);
  result['vega'] = S*sqt*nd1;
  result['theta'] = -(S*v*nd1)/(2*sqt) - r*K*ert*Nd2;
  result['rho'] = K*t*ert*Nd2; 
  return ( result);
 
} //end of black_scholes put

function option_price(option_type,S,K,r,v,t){
	if (option_type == 'CE' || option_type == 'Call' || option_type == 'C'){
		return call_price(S,K,r,v,t);
	}else if (option_type == 'PE' || option_type == 'Put' || option_type == 'P'){
		return put_price(S,K,r,v,t);
	}
}

function IV(option_type,S,K,r,t,P){
	upper_bound=2;
	lower_bound=0;
	p_estimate=option_price(option_type,S,K,r,(lower_bound+upper_bound)/2.0,t)['price'];
	while (Math.abs(upper_bound-lower_bound)>0.000001){
		p_estimate=option_price(option_type,S,K,r,(lower_bound+upper_bound)/2.0,t)['price'];
		if (p_estimate<P) lower_bound=(lower_bound+upper_bound)/2.0;
		else if (p_estimate>P) upper_bound=(lower_bound+upper_bound)/2.0;
	}
	return (lower_bound+upper_bound)/2.0;
}