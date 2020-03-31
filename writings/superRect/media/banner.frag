#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
//
float tanh(float t)
{
    float e=exp(2.*t);
    return(e-1.)/(e+1.);
}
//
float atanh(float x)
{
    return.5*log((1.+x)/(1.-x));
}
//
const float k=1.19228;
//
float sinf(float t)
{
    return tanh(k*tan(t));
}
//
float asinf(float y)
{
    return atan(atanh(y)/k);
}
//
float cosf(float t)
{
    return tanh(k/tan(t));
}
//
float acosf(float x)
{
    return atan(k/atanh(x));
}
//
vec4 getColor(float fill,float stroke)
{
    vec4 color=vec4(1.);
    color.rgb=mix(vec3(0.),color.rgb,fill);
    color.rgb=mix(color.rgb,vec3(1.),stroke);
    return color;
}

void main()
{
    float s=2.;
    // set up the composition
    float scale=s/min(u_resolution.x,u_resolution.y);
    vec2 p=scale*(2.*gl_FragCoord.xy-u_resolution.xy);
    // make sure it's always at least a certain size
    float r=max(16.*scale,.015);
    //animate
    float t=1.5*u_time;
    float sine=.5+.5*sin(t);
    float tri=.5+asin(sin(t))/3.14;
    float h=mix(tri,sine,ceil(cos(t)));
    //height
    // p.y-=mix(0.,sqrt(2.),h)-1.;
    // take advantage of symmetry
    p=-abs(p);
    // add padding
    // p*=1.+r;
    // conserve area
    // t=fract(clamp((2.*sin(t)+1.)/3.,0.,1.));
    // p+=(vec2(mix(2.,sqrt(2.),t),mix(1.,sqrt(2.),t))-1.);
    //stay stable
    // p.x=min(p.x,0.);
    // p.y=min(p.y,-.000001);
    // since the shape is convex we can be sure which points are inside
    float florp=1.-clamp(dot(p,p)/(s*s),0.,1.);
    float x=p.y-sinf(acosf(p.x));
    float y=p.x-cosf(asinf(p.y));
    float fill=1.-step(.0,x)*step(.0,y);
    // florp=sign(florp)*min(abs(florp),.9);
    // florp=abs(florp);
    // florp=clamp(florp,0.,1.);
    fill=1.-exp(-1./florp)/exp(-1.);
    // distance field becomes assymptotically correct as points get close to curve
    float d=x*y*inversesqrt(x*x+y*y);
    float stroke=smoothstep(r,r-4.*scale,d);
    // render
    gl_FragColor=getColor(fill,stroke);
}