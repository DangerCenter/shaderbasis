var buffer, id;
var width, height;
var ctx, canvas;
var startTime;

function run()	{
	canvas = document.getElementById("myCanvas");
	width = canvas.width;
	height = canvas.height;
	ctx = canvas.getContext("2d");
	console.log(width,height);
	id = ctx.createImageData(width,height); // only do this once per page
	buffer = id.data;
	startTime = Date.now()
	draw();
}


function draw()	{
	var x=0,y=0;
	var extensions = {
		"res"			: 	{"x": width, "y": height  },
		"time"			: 	(Date.now()-startTime) / 1000
	}
	var cw = 2.0 / width,
		ch = 2.0 / height,
		c;
	var start = Date.now();
	while(y<height)	{
		x=0;
		while(x<width)	{
			c = Shader([(x/width)*2-0.5,(y/height)*2-0.5], extensions);
			buffer[(y*width+x)*4+0] = c[0]*255;
			buffer[(y*width+x)*4+1] = c[1]*255;
			buffer[(y*width+x)*4+2] = c[2]*255;
			buffer[(y*width+x)*4+3] = c[3]*255;
			++x;
		}
		++y;
	}
	ctx.putImageData( id, 0, 0 ); 
	start = Date.now() - start;
	console.log("Took "+start+" ms to draw.");
	window.requestAnimationFrame(draw);
}
/*
function Shader(fragcoord, extensions)	{
	var color = [0,0,0,1.0];
	var uv = { "x" : fragcoord[0], "y": fragcoord[1]};
    if(uv.x < 0.5 && uv.y < 0.5) {
        color[0] = 1.0;
        color[1] = 0.0;
        color[2] = 0.0;
    }else if(uv.x > 0.5 && uv.y < 0.5) {
        color[0] = 0.0;
        color[1] = 1.0;
        color[2] = 0.0;
    }else if(uv.x > 0.5 && uv.y > 0.5) {
        color[0] = 0.0;
        color[1] = 0.0;
        color[2] = 1.0;
    }else if(uv.x < 0.5 && uv.y > 0.5) {
        color[0] = 1.0;
        color[1] = 1.0;
        color[2] = 1.0;
    }

	return color;
}*/

function clamp(val, min, max) {
	return Math.max(min, Math.min(max, val));
}

function length(vector)	{
	if(vector.hasOwnProperty("x"))	
		return Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z+vector.z);
	else if(vector.length == 3)
		return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2])
	else
		return Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1])
}


function func(x){
	return Math.sin(x);
	//return Math.sin(x) + .3*Math.sin(x*4.5);
}

var iterations =14;
var formuparam =0.530;

var volsteps =8;
var stepsize =0.2;

var zoom  = 0.800;
var tile  = 0.850;
var speed = 0.01;

var brightness =0.0015;
var darkmatter =0.400;
var distfading =0.760;
var saturation =0.800;

function dot(a,b)	{
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function mix(x,y,a)	{
	return x * (1-a) + y * a;
}

function Shader(fragcoord, ext)	{
	var uv = { "x" : fragcoord[0]-.5, "y": fragcoord[1]-.5 };
	var position = uv;
	var colour = {
		x: 0,
		y: 0,
		z: 0
	}
	
	var density = 0.15;
	var amplitude = 0.3;
	var frequency = 5.0;
	var scroll = 0.4;


		colour.x += 0.10 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x + ext.time * scroll) *frequency)))) * density);
		colour.y += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x + ext.time * scroll) *frequency)))) * density);
		colour.z += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x + ext.time * scroll) *frequency)))) * density);

		colour.x += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.3 + ext.time * scroll) *frequency)))) * density);
		colour.y += 0.10 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.3 + ext.time * scroll) *frequency)))) * density);
		colour.z += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.3 + ext.time * scroll) *frequency)))) * density);

		colour.x += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.5 + ext.time * scroll) *frequency)))) * density);
		colour.y += 0.05 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.5 + ext.time * scroll) *frequency)))) * density);
		colour.z += 0.10 * (1.0 / Math.abs((position.y + (amplitude * Math.sin((position.x - 0.5 + ext.time * scroll) *frequency)))) * density);

		//colour += vec3	(0.05, 0.1, 0.05) * (1.0 / abs((position.y + (amplitude * sin(((position.x-0.1) + time * scroll) *frequency)))) * density);
		//colour += vec3	(0.05, 0.05, 0.1) * (1.0 / abs((position.y + (amplitude * sin(((position.x-0.2) + time * scroll) *frequency)))) * density);
	
	return [colour.x,colour.y,colour.z,1.0];
}

/*

function Shader(fragcoord, ext)	{
	var uv = { "x" : fragcoord[0]-.5, "y": fragcoord[1]-.5 };
	//get coords and direction

	//uv.y*=ext.res.y/ext.res.x;
	dir = {
		x: uv.x * zoom,
		y: uv.y * zoom,
		z: 1
	}
	
	var a2=speed+.5;
	var a1=0.0;
	
	from = {
		x: 0,
		y: 0,
		z: 0
	}
	from.x-=ext.time;

	from.x += 0.05;
	from.y += 0.05;
	from.z += -2.0;
	

	
	//volumetric rendering
	var s=.4,fade=.2;
	var v= {
		x : 0.4,
		y : 0.4,
		z : 0.4
	};

	for (var r=0; r<volsteps; r++) {
		var p = {
			x : from.x + s * dir.x * 0.5,
			y : from.y + s * dir.y * 0.5,
			z : from.z + s * dir.z * 0.5
		}

		p.x = Math.abs(tile - p.x % (tile * 2) ) ;
		p.y = Math.abs(tile - p.y % (tile * 2) ) ;
		p.z = Math.abs(tile - p.z % (tile * 2) ) ;

		var pa,a=pa=0.;

		for (var i=0; i<iterations; i++) { 
			p.x = Math.abs(p.x) / dot(p,p) - formuparam;
			p.y = Math.abs(p.y) / dot(p,p) - formuparam;
			p.z = Math.abs(p.z) / dot(p,p) - formuparam;

			a+=Math.abs(length(p)-pa); // absolute sum of average change

			pa=length(p);
		}
		var dm=Math.max(0.,darkmatter-a*a*.001); //dark matter
		a*=a*a*2.; // add contrast
		if (r>3) fade*=1.-dm; // dark matter, don't render near
		//v+=vec3(dm,dm*.5,0.);
		v.x += fade;
		v.y += fade;
		v.z += fade;

		v.x += s * a * brightness * fade;
		v.y += s*s * a * brightness * fade;
		v.z += s*s*s*s * a * brightness * fade;

		fade*=distfading; // distance fading
		s+=stepsize;
	}
	v.x = mix(length(v),v.x, saturation);
	v.y = mix(length(v),v.y, saturation);
	v.z = mix(length(v),v.z, saturation);
	return [v.x * 0.01, v.y *0.01, v.z *0.01, 1.0];
}
*/
/*
function Shader(fragcoord, ext)	{
	var uv = { "x" : fragcoord[0], "y": fragcoord[1] };
	//var pos = {x : uv.x / ext.res.x, y: uv.y / ext.res.y};
	var pos = uv;
	var x_offset = ext.time*0.7;
	var y_offset = -1.8;
	var x_scale = 0.4;
	var y_scale = 0.3;
	var x = pos.x/x_scale+x_offset;
	var y = pos.y/y_scale+y_offset;
	var c = 0.2;
	var width = 0.01;
	
	//if(abs(y-sin(x))<width){
	if(Math.abs(y-func(x))<width){
		//c=1.0-abs(y-sin(x));
		//c = min(max(0.2,pow(c,80.0)),0.8);
		c = 0.5;
	}
	
	return [c,c,c,1.0];
}*/