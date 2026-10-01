import {defineConfig} from '@apps-in-toss/web-framework/config';
const appName=process.env.TOSS_APP_NAME||'rift-keepers';
if(!/^[a-z][a-z0-9-]*$/.test(appName))throw new Error('Invalid appName');
export default defineConfig({appName,brand:{primaryColor:'#79DBBE'},webBundleDir:'dist',permissions:[],
navigationBar:{withBackButton:false,withHomeButton:false,withTitle:false,transparentBackground:true,theme:'dark'},
webView:{bounces:false,pullToRefreshEnabled:false,overScrollMode:'never',allowsInlineMediaPlayback:true,mediaPlaybackRequiresUserAction:true,allowsBackForwardNavigationGestures:false}});
