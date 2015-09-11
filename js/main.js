require.config({
    shim: {
        "foundation": {

            deps: ['jquery', 'modernizr']
        },
        "jquery-ui": {
            deps: ['jquery']
        },
        "mustache": {
            deps: ['jquery']
        }

    },
    paths: {
        //"zepto": "vendor/zepto/zepto.min",
        "jquery": "jquery.min",
        "foundation": "foundation.min",
        "modernizr": "custom.modernizr",
        "jquery-ui": "jquery-ui.min",
        "mustache": "mustache"

    }

});

require(["text!templates/popup_template.html",
    "mustache", "foundation"],
    function (popup_template, Mustache){
        chrome.storage.local.get({adTag:"",align:"",view:""}, function(data){
            var html = Mustache.to_html(popup_template, data);
            $("#main-container").html(html);

            $("#views option[value='"+data.view+"']").attr("selected","selected");
            $("#alignment option[value='"+data.align+"']").attr("selected","selected");
            $(window.document).foundation();
            $('#adTag').on("click", function(event){
                event.target.select();
            });

            $("#render-tag").on("click", function (e) {
                e.preventDefault();
                var tab_id = chrome.extension.getBackgroundPage().tab_id;
                var view = $("#views option:selected").val() || "default";
                var align = $("#alignment option:selected").val() || "center";
                var adTag = $("#adTag").val();
                chrome.storage.local.set({adTag: adTag, align:align, view:view}, function(data){
                    $.post('http://10.1.1.220:3300/temp_tests?render='+view+"&align="+align,{code: adTag, title:"test"}, function(data) {
                        var dataURI = "data:text/html;charset=UTF-8,"+data;
                        if(tab_id){
                            chrome.tabs.update(tab_id,{url: "http://10.1.1.220:3300/lite","active":true,"highlighted":true},function (tab){
                                chrome.extension.getBackgroundPage().adPage = data.replace(/(\r\n|\n|\r)/gm," ");
                                // chrome.tabs.reload(tab_id);
                            });
                        } else {
                            chrome.tabs.create({url:"http://10.1.1.220:3300/lite"}, function(tab){
                                chrome.extension.getBackgroundPage().adPage = data.replace(/(\r\n|\n|\r)/gm," ");
                                chrome.extension.getBackgroundPage().tab_id = tab.id;
                            });
                        }

                    },"text");
                });

            });

            $("#save-tag").on("click", function (e) {
                e.preventDefault();
                var nameField = $("#ad-name");
                var name;
                if (!nameField.val()){
                    nameField.show();
                    return;
                }
                var name = nameField.val();

                var adTag = $("#adTag").val();
                chrome.storage.local.set({adTag: adTag}, function(data){
                    $.post('http://10.1.1.220:3300/tags',{code: adTag, name:name, description: "Created in #voltron-lite"}, function(data) {
                            nameField.hide();
                            chrome.tabs.create({url:"http://voltron.postapp.com/#tags"}, function(){});
                    },'json');
                });
            });

        });

    });
