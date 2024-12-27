window.addEventListener("load", function(){

    const point = window.innerHeight - 150;
    const html = document.querySelector("html");
    const header = document.querySelector("header");
    let section = document.querySelectorAll("main .section");
    let off = document.querySelectorAll("main .off");
    let tabIndex = document.querySelectorAll("main [tabIndex]");
    
    
    function onTab(){
        
        const tab = this.closest(".section").getAttribute("tab");
        const section = document.querySelectorAll(`main .section[tab='${tab}']`);
        
        const index = Number(this.getAttribute("tabIndex")) - 1;
        
        section.forEach(function(el){
            el.classList.remove("active");
        })
        
        section[index].classList.add("active");
        
    }
    
    function moveScroll(){
        
        const top = window.pageYOffset;
        
        if(header != null){
            if(top){
                header.classList.add("view");
            }else{
                header.classList.remove("view");
            }
        }
        
        // main height take offsetTop
        section.forEach(function(that){
            if( top > that.offsetTop - 400 ){
               
               that.classList.add("view");
               html.setAttribute("index", that.getAttribute("id"));
                
            }else{
               that.classList.remove("view");
            }
        });
        
        // section inner off class not call document position value
        off.forEach(function(that){
            
            const pos = getPosition(that);
            
            if ( top > ( pos.top - point ) ){
                that.classList.remove("off");
                that.classList.add("on");
            }else{
                that.classList.remove("on");
                that.classList.add("off");
            }
            
            
        })
        
    }
    
    function onScroll() {
        throttle(function(){
            moveScroll();
        });
    }

    function onResize(){
        throttle(function(){
            section = document.querySelectorAll("main .section");
            off = document.querySelectorAll("main .off");
            moveScroll();
        });
    }
    
    function throttle(_function){
        
        let scheduledAnimationFrame = false;
        
        if (scheduledAnimationFrame) {
            return;
        }
        
        scheduledAnimationFrame = true;
        requestAnimationFrame(function() {
            
            // function start
            _function();
            
            // do something
            scheduledAnimationFrame = false;
            
        });
        
    }
    
    function getPosition(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
    
    // frist event
    moveScroll();
    
    // setting event
    [].forEach.call(tabIndex, function(el){
        el.addEventListener("click", onTab);
    })
    
    document.addEventListener("scroll", onScroll);
    document.addEventListener("resize", onResize);
    
})


