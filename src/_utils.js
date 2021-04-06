
import {isRef} from 'vue'
// busy
export function dfn__busy_prevent(fn, busyState) {
    let busy
    if(isRef(busyState)){
        busy = busyState
        return function(ev){
            if(busy.value.value){
                console.log('busy')
                return
            }
            fn.apply(null, arguments);
            
            busy.value.value = true
            // setTimeout(function(){
            //     busy.value.value = false
            // }, 1500)
        }
    }else{
        busy = false
        return function(ev){
            if(busy){
                console.log('busy')
                return
            }
            fn.apply(null, arguments);
            
            busy = true
            setTimeout(function(){
                busy = false
            }, 1500)
        }
    }    
}
// hideOnClickOutside
export function hideOnClickOutside(element) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
          element.style.display = 'none'
          removeClickListener()
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ) // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js