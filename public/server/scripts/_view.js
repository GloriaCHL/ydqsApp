'use strict';

var imgUpload = {
    UL_PARENT:null,
    getFile : function(inp){
        var _this = this;
        var files = inp.files;
        _this.UL_PARENT = $($(inp).attr('data-target')+' ul');
        if(files.length == 0){return}
        _this.buildHTML(files);
        _this.bind_fn();
    },
    buildHTML : function(files){
        var _this = this;
        var i = 0, len = files.length;
        function appendLi(){
            var f = files[i];
            if(!f.type || f.type.indexOf('image')===-1){
                i++;
                if(i<len){
                    appendLi();
                }
                return;
            }
            var img = document.createElement('img');

            if($browser.chrome){
                img.src = window.webkitURL.createObjectURL(f);
            }else if($browser.mozilla){
                img.src = window.URL.createObjectURL(f);
            }else{
                var reader = new FileReader();
                reader.onload = function(){
                    img.src = this.result;
                };
                reader.readAsDataURL(f);
            }

            img.onload = function(){
                var _img = $(this);
                var _html = $('<li id="cacheLi'+i+'"><a href="javascript:;" class="remove"><span class="glyphicon glyphicon-trash"></span></a></li>');
                _html.append(_img);
                _this.UL_PARENT.append(_html);
                resizeImg(this.width,this.height,$(this));
                i++;
                if(i<len){
                    appendLi();
                }else{
                    _this.uploadImg(files);
                }
                // 添加后取消 onload 事件的绑定，否则当服务器传回服务器段src链接重新设定src的时候会再次触发 onload 事件。
                img.onload = null;
            };
        }
        appendLi();
    },
    uploadImg : function(files){
        var i = 0, len = files.length, _this = this;

        function sendFile(){
            var file = files[i];

            if(!file.type || file.type.indexOf('image')===-1){
                i++;
                if(i<len){
                    sendFile();
                }
                return;
            }

            var _data = new FormData();
            _data.append('uploadFile',file);

            /*var xhr = new XMLHttpRequest();
            xhr.open("post","admin/uploadgoodImages",true);
            xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");

            xhr.addEventListener("load",function(){
                if(xhr.readyState == 4){
                    if(xhr.status==200){
                        var data = $.parseJSON(xhr.responseText);
                        if(data.success){
                            $('#cacheLi'+ i +' img').attr('src',data.src);
                            i++;
                            if(i<len){
                                sendFile();
                            }
                        }
                    }
                }
            },false);

            xhr.send(_data);*/

            $.ajax({
                url:'admin/uploadgoodImages',
                method:'POST',
                data:_data,
                contentType: false,
                processData:false,
                dataType:'json',
                cache:false
            }).
                done(function(data){
                    $('#cacheLi'+ i +' img').attr('src',data.src);
                    if(i<len-1){
                        i++;
                        sendFile();
                    }
                }).
                fail(function(){
                    console.log('Image '+ i +' upload fail!')
                })
        }

        sendFile();
    },
    removeImg : function(target){
        var _this = this;
        var _src = target.siblings('img').attr('src');
        target.parent().remove();
        $.ajax({
            url:'/admin/removecacheImage',
            data:{'src':_src},
            method:'POST',
            dataType:'json'
        })
    },
    bind_fn : function(){
        var _this = this;
        $('.local-preview').on('click','.remove',function(){
            _this.removeImg($(this));
        })
    }
};

var userAgent = navigator.userAgent.toLowerCase();
var $browser = {
    safari:/webkit/.test(userAgent) && !/chrome/.test(userAgent),
    opera:/opr/.test(userAgent),
    msie:/msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla:/mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
    chrome:/chrome/.test(userAgent)
};

function resizeImg(w,h,item){
    var orz = 250,_w,_h,per=w/h,mt,ml;
    if(w>h){
        _w = orz;
        _h = _w/per;
        mt = (orz-_h)/2;
    }else if(w<h){
        _h=orz;
        _w=per*_h;
        ml = (orz-_w)/2;
    }else{
        _w = _h = orz;
    }
    item.css({'width':_w,'height':_h,'margin-left':ml||0,'margin-top':mt||0});
}