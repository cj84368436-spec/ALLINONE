import {Art} from "./art.js";
export function drawPainted(c,key,x,y,width,height,angle=0,alpha=1){const frame=Art.painted.get(key);if(!frame)return false;if(height===undefined)height=width*frame.height/frame.width;if(![x,y,width,height,angle,alpha].every(Number.isFinite)||width<=0||height<=0)return false;c.save();c.translate(x,y);c.rotate(angle);c.globalAlpha*=Math.max(0,Math.min(1,alpha));c.drawImage(frame,-width/2,-height/2,width,height);c.restore();return true;}
export function paintedRatio(key){const f=Art.painted.get(key);return f?f.width/f.height:1;}
