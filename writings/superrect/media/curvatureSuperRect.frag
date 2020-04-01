#ifdef GL_ES
precision lowp float;
#endif

uniform vec2 u_resolution;
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
    float f=tanh(k*tan(t));
    return f;
}
//
float asinf(float y)
{
    float f=atan(atanh(y)/k);
    return f;
}
//
float cosf(float t)
{
    return tanh(k/tan(t));
}
//
float acosf(float x)
{
    float f=atan(k/atanh(x));
    return f;
}
//
vec4 getColor(float fill,float stroke)
{
    vec4 color=vec4(0.);
    color=mix(color,vec4(vec3(1.),1.),fill);
    color=mix(color,vec4(vec3(0.),1.),stroke);
    return color;
}

void main()
{
    // set up the composition
    float scale=1./min(u_resolution.x,u_resolution.y);
    vec2 p=scale*(2.*gl_FragCoord.xy-u_resolution.xy);
    // make sure it's always at least a certain size
    float r=max(16.*scale,.015);
    p*=1.+r;
    // take advantage of symmetry
    p=-abs(p);
    //stay stable
    p.x=min(p.x,0.);
    p.y=min(p.y,-.000001);
    float dd=1000.;
    float fill=0.;
    float ff=0.;
    vec2 s=p;
    float ss=1.;
    vec2 pp=p;
    for(int i=0;i<5;i++)
    {
        ss=1./(1.-.1*float(i));
        s=pp*ss;
        p=s;
        //stay stable
        p.x=min(p.x,0.);
        p.y=min(p.y,-.000001);
        // since the shape is convex we can be sure which points are inside
        float x=p.y-clamp(sinf(acosf(p.x)),-1.,1.);
        float y=p.x-clamp(cosf(asinf(p.y)),-1.,1.);
        ff=step(.0,x)*step(.0,y);
        fill+=ff;
        // distance field becomes assymptotically correct as points get close to curve
        float d=x*y*inversesqrt(x*x+y*y);
        dd=min(dd,abs(d)/ss);
    }
    fill=min(fill,1.);
    fill-=ff;
    float stroke=smoothstep(r,r-4.*scale,dd);
    // render
    gl_FragColor=getColor(fill,stroke);
}