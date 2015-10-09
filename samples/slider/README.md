## MU for mobile

##### slider | 轮播

### 使用:

需要: mu [查看](https://github.com/Roeis/MU/tree/master/dist)

**推荐在$(function(){})中初始化**, 避免某些浏览器的兼容问题

    // 构造器模式
    var slider = new MuSlider('.wrapper', {
        autoSlide: false,                   //自动轮播
        isLoop: true,                       //是否创建克隆，连续循环
        speed: 500,                         //滑动速度
        isVert: false,                      //滑动方向, 一般仅应用在单屏滑动页面中
        isHidden: true,                     //容器是否支持溢出
        timing: true,
        beforeSlide: function(index) {},
        afterSlide: function(index) {}
    });


    // 轮播
    $('.element').muSlider({
        afterSlide: function(index){
            // callback after each slide
        }
    });

    // 获取实例，稍稍繁琐
    // zepto本身的 data 方法不足，虽然zepto提供了data的拓展
    // 考虑通用性，把实例都缓存在一个对象里
    $.fn.muDialog.instances[$('.dialog').data('muDialog')];

    注：PC下也能点击滑动

######特别参数:

    isVert 是否是垂直方向的滑动
    default value : false
    垂直应用场景 : 整屏滑动, 类似页面转场, [注意:将自动禁止全局touchmove事件]
    水平应用常用 : 普通广告轮播

### API:
// 设slider为一个实例

**method: jump(number)**
    
    slider.jump(2);

**method: prev**
    
    slider.prev();

**method: next**
    
    slider.next();


### log:
15/10/09 修正slider垂直方向时，设置高度取消

15/09/23 添加回调参数, $pageou, $pagein

15/19/18 新增选项，可配置transition-timing-function

15/09/15 修复点击时触发jump漏洞

15/09/13 新增选项，容器是否支持溢出，

15/09/02 修复横竖屏的自适应问题， 修复快速滑动导致isAnimating===true的问题

15/09/01 初始化可以放在document.ready中，在firefox mobile取值异常

15/08/14 新增支持PC操作
