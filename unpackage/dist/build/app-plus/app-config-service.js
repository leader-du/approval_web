
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/index/index","pages/applytype/applytype","pages/index/changePwd","pages/borrowMoney/borrowMoney","pages/applyRefund/applyRefund","pages/approvalDetail/approvalDetail","pages/myApproval/myApproval","pages/updateApproval/updateApproval","pages/toApproval/toApproval","pages/leaderApprovalDetail/leaderApprovalDetail","pages/approvalProgress/approvalProgress","pages/completedApproval/completedApproval","pages/completedApprovalDetail/completedApprovalDetail","pages/admin/manageList","pages/admin/dept/dept","pages/admin/dept/addDept","pages/admin/user/user","pages/admin/user/addUser","pages/admin/user/delUser","pages/admin/approval/delApprovalRecord","pages/admin/admin/admin","pages/admin/admin/delAdmin","pages/admin/admin/addAdmin","pages/admin/user/updateUser","pages/admin/user/updateUserDetail","pages/admin/dept/delDept","pages/admin/dept/updateDept","pages/admin/dept/updateDeptDetail","pages/admin/admin/updateAdmin","pages/admin/admin/updateAdminDetail"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"盛邦报销借款审批系统","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"审批系统","compilerVersion":"2.9.7","entryPagePath":"pages/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/index/index","meta":{"isQuit":true},"window":{"navigationBarTitleText":"盛邦报销借款审批系统"}},{"path":"/pages/applytype/applytype","meta":{},"window":{}},{"path":"/pages/index/changePwd","meta":{},"window":{}},{"path":"/pages/borrowMoney/borrowMoney","meta":{},"window":{}},{"path":"/pages/applyRefund/applyRefund","meta":{},"window":{}},{"path":"/pages/approvalDetail/approvalDetail","meta":{},"window":{}},{"path":"/pages/myApproval/myApproval","meta":{},"window":{}},{"path":"/pages/updateApproval/updateApproval","meta":{},"window":{}},{"path":"/pages/toApproval/toApproval","meta":{},"window":{}},{"path":"/pages/leaderApprovalDetail/leaderApprovalDetail","meta":{},"window":{}},{"path":"/pages/approvalProgress/approvalProgress","meta":{},"window":{}},{"path":"/pages/completedApproval/completedApproval","meta":{},"window":{}},{"path":"/pages/completedApprovalDetail/completedApprovalDetail","meta":{},"window":{}},{"path":"/pages/admin/manageList","meta":{},"window":{}},{"path":"/pages/admin/dept/dept","meta":{},"window":{}},{"path":"/pages/admin/dept/addDept","meta":{},"window":{}},{"path":"/pages/admin/user/user","meta":{},"window":{}},{"path":"/pages/admin/user/addUser","meta":{},"window":{}},{"path":"/pages/admin/user/delUser","meta":{},"window":{}},{"path":"/pages/admin/approval/delApprovalRecord","meta":{},"window":{}},{"path":"/pages/admin/admin/admin","meta":{},"window":{}},{"path":"/pages/admin/admin/delAdmin","meta":{},"window":{}},{"path":"/pages/admin/admin/addAdmin","meta":{},"window":{}},{"path":"/pages/admin/user/updateUser","meta":{},"window":{}},{"path":"/pages/admin/user/updateUserDetail","meta":{},"window":{}},{"path":"/pages/admin/dept/delDept","meta":{},"window":{}},{"path":"/pages/admin/dept/updateDept","meta":{},"window":{}},{"path":"/pages/admin/dept/updateDeptDetail","meta":{},"window":{}},{"path":"/pages/admin/admin/updateAdmin","meta":{},"window":{}},{"path":"/pages/admin/admin/updateAdminDetail","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
