## MU for mobile

##### dialog | 弹窗

### 使用:

需要: mu [查看](https://github.com/Roeis/MU/tree/master/dist)

**推荐在$(function(){})中初始化**, 避免某些浏览器的兼容问题

    // 构造器模式
    var dialog = new window.MuDialog('<div class="dialog">test</div>', {
        isBgCloseable: true,                    // 点击背景是否关闭弹窗
        showClass: 'mu-scaleDownIn',            // 自定义弹窗进场动画, css3 animation
        hideClass: 'mu-scaleDownOut',           // 自定义弹窗出场动画
        preset: 'scaleDownIn',                  // 样式组合, scaleUpIn, scaleDownIn, fadeIn, fadeInUp, fadeInDown, fadeInRight
        isCenter: true,
        zIndex: 1000,                           // 大于这个值
        opacity: 0.8,                          // 背景透明度
        beforeOpen: function() {},
        afterOpen: function() {},
        beforeClose: function() {},
        afterClose: function() {}
    });

    // zepto|jquery 插件模式
    $('<div class="dialog">test</div>').muDialog({
        // options
    });
    
    $('.dialog').muDialog('open');
    
    // 获取实例，稍稍繁琐
    // zepto本身的 data 方法不足，虽然zepto提供了data的拓展
    // 考虑通用性，把实例都缓存在一个对象里
    $.fn.muDialog.instances[$('.dialog').data('muDialog')];
    
######交互效果:

    默认提供了几套弹窗交互效果
    classSet: 'scaleUpIn|...'
    如果需要自定义弹窗效果, 修改 classSet: false
    修改showClass和hideClass

######位置:

    默认将元素取得高度后居中
    如果需要自定义, 修改 isCenter: false
    此时直接以实例化的该元素的样式为准
    PS: 元素实例化后 postion: fixed


### API:
// 设dialog为一个实例

**method: open**
    
    dialog.open();

**method: close**
    
    dialog.close();

**method: html(string)**
    
    dialog.html('your markup here')

引用该组件后，在mu.util工具方法中拓展以下方法

**mu.util.tip(string, [duratime])**
    
    mu.util.tip('这是一个自动消失的小提示');

**mu.util.confirm(string, [callback])**
    
    mu.util.confirm('你确定要修改吗？', function(flag){
        if(flag){
            // do something A();
        }else{
            // do something B();
        }
    });

**mu.util.alert(string)**
    
    mu.util.alert('这是一个警示框');




### known issue:
1.在魅族自带浏览器显示效果异常, 对于animation支持非常不友好, 在魅族的微信中显示效果正常

2.页面中存在gif等处于一直渲染状态，使用backface-visibility后，依然出现闪烁现象，考虑取消动画，在没有问题的机型上使用动画效果

### log
15/09/06 修复横竖屏问题，兼容chrome, baidu

15/09/02 修复横竖屏的自适应问题

15/09/01 初始化可以放在document.ready中，在firefox mobile取值异常

15/08/31 修复firefox, UC, baidu浏览器的位置显示BUG
