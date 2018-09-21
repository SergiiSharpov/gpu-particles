attribute vec3 color;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform float power;
uniform float particleSize;

varying vec3 u_color;

//Noise defenition
float tri( float x ){
  return abs( fract(x) - .5 );
}

vec3 tri3( vec3 p ){

  return vec3(
      tri( p.z + tri( p.y * 1. ) ),
      tri( p.z + tri( p.x * 1. ) ),
      tri( p.y + tri( p.x * 1. ) )
  );

}


float triNoise3D( vec3 p, float spd , float time){

  float z  = 1.4;
	float rz =  0.;
  vec3  bp =   p;

	for( float i = 0.; i <= 3.; i++ ){

    vec3 dg = tri3( bp * 2. );
    p += ( dg + time * .1 * spd );

    bp *= 1.8;
		z  *= 1.5;
		p  *= 1.2;

    float t = tri( p.z + tri( p.x + tri( p.y )));
    rz += t / z;
    bp += 0.14;

	}

	return rz;

}

//End noise defenition


void main()
{
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vec4 screenPos = projectionMatrix * mvPosition;

    vec2 mp = (-resolution.xy + 2.0*mouse.xy) / resolution.y;
    vec2 current = vec2(screenPos.xy) / screenPos.z;
    current.y *= -1.0;

    vec2 dist = vec2(current.xy - mp.xy);
    float l = pow(1.0 - length(dist), 1.0);

    float r = 0.3 + pow(triNoise3D(normal * 2.0 + time * vec3(-0.05, 0.1, 0), 1.0, time), 6.0);
    float dx = pow(1.0 - (length(r) - l), 8.0);

    vec4 transformed = mvPosition + vec4(normal*4.0*dx*power, 0.0);

    float difference = pow(length(transformed - mvPosition), 1.0) * 0.01;
    float pwd = smoothstep(0.0, 1.0, difference);

    u_color = color + vec3(1.0, 0.5, 0.0) * difference;

    gl_PointSize = particleSize;
    gl_Position = projectionMatrix * transformed;
}