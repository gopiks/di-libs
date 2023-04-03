/*
Array.to_dict(header=[],orient="records")
Dict.to_array(orient="records")
Array.to_csv(header=[])

*/


Array.prototype.to_csv = function(header){
	if (header==undefined)
	 h="";
	else h=header.join(",")+"\n";
	
	csv=this.map(x=>x.join(",")).join("\n");
	
	return h+csv;

}

Array.prototype.from_csv= function(csv,start,header){
	lines=csv.split("\n");
	if(start!=undefined) lines.shift(start);
	if(header) {h=lines[0];lines.shift(1);}
	return {header:h,data:lines.map(l=>l.split(","))}
		
}