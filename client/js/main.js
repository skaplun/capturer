 var URL;
        
        
        rulesModal = {
            
            rules : {
                'viewport' : {
                    'title' : 'update viewport',
                    'html' : crel('div', {'class': 'viewport'}, 
                                crel('label', 'update viewport to'), 
                                crel('label', 'width'),
                                crel('input',{type: 'text', placeholder: 'width'}),
                                crel('label', 'height'),
                                crel('input',{type: 'text', placeholder: 'height'}, 'height')
                            )
                },
                'click' : {
                    'title': 'click on element',
                    'html': crel('div', {'class': 'click'},
                            crel('label', 'enter selector of element to click'),
                            crel('input', {type : 'text', placeholder: 'selector'}),
                            crel('button', 'don"t know the selector?')
                            )
                    
                },
                'screenshot' : {
                    'title' : 'take screenshot',
                    'html' : crel('div', {'class': 'screenshot'}, 
                            crel('label', 'take screenshot')
                    )
                },
                
                'remove' : {
                    'title' : 'remove element',
                    'html' : crel('div', {'class': 'remove'},
                            crel('label', 'enter selector of element to remove'),
                            crel('input', {type : 'text', placeholder: 'selector'}),
                            crel('button', 'don"t know the selector?')
                            )
                },
                'z-index-above' : {
                    
                    'title': 'remove elements above z-index',
                    'html': crel('div', {'class': 'z-index-above'},
                        crel('label', 'remove all elements above z-index of'),
                        crel('input', {'type' : 'text', 'placeholder' : 'enter z-index'})
                    )
                },
                
                'z-index-below' : {
                    'title' : 'remove all elements below z-index of',
                    'html' : crel('div', {'class': 'z-index-above'},
                         crel('label', 'remove all elements below z-index of'),
                         crel('input', {'type' : 'text', 'placeholder' : 'enter z-index'})
                    )
                    
                },
                'wait-selector' : {
                    
                    'title' : 'wait for selector to be visible',
                    'html' : crel('div', {'class': 'wait-selector'},
                                 crel('label', 'remove all elements below z-index of'),
                                 crel('input', {'type' : 'text', 'placeholder' : 'enter z-index'})
                    )
                },
                'wait' : {
                    
                    'title' : 'wait X seconds',
                    'html' :  crel('div', {'class': 'wait'},
                                 crel('label', 'remove all elements below z-index of'),
                                 crel('input', {'type' : 'text', 'placeholder' : 'enter z-index'})
                    )
                }
                
            },
            
            modal : {
                    'body' : crel('div', {'class': 'panel panel-default layer'},
                                 crel('div', {'class': 'panel-heading'},
                                    crel('h2', 'execute query')
                                ),
                                crel('div', {'class': 'panel-body'},
                                    crel('div', {'class': 'queryTitles'}),
                                    crel('div', {'class': 'queryHtml'})
                                ),
                                crel('button', {'class': 'btn btn-primary modalMainButton'}, 'execute')
                                
                    ),
                    'button' : crel('button', {'class': 'btn'}),
                    
                    'then': crel('div',
                        crel('span', {'class': 'label label-info'})
                    )
            },
        
        
            titleButtons : function(qTitles, qHtml) {
              var rules = rulesModal.rules
              
               Object.keys(rulesModal.rules).forEach(function(argument) {
                   
                   var btn = $(rulesModal.modal.button);
                   var title =rules[argument].title;
                   
                   qTitles.append(btn.clone().text(title));
                   
               })
                
                qTitles.click(function(e) {
                    
                    if(e.target.tagName !== "BUTTON") return false;
                    
                    
                    
                    Object.keys(rules).forEach(function(key) {
                        if(rules[key].title == e.target.textContent) {
                            qHtml.append($(rules[key].html).clone());
                        }
                    });
                    
                })
            },
            
            submitModalForm : function(qHtml) {
                var data = {};
                var counter = 0;
                
                qHtml.find('div').each(function(i, div){
                    var localData = [];
                    localData.push(div.className)
                    
                    $(div).find('input').each(function(i, input) {
                        localData.push(input.value)
                    })
                    
                    data[counter] = localData;
                    counter++;
                    localData = [];
                    
                })
                
                data['url'] = URL;
                
                $.post('/chunk', data, function() {
                    console.log(arguments);
                })
                
            },
                        
            start : function() {
                
                var modal = $(this.modal.body);
                modal.appendTo('body');
                
                var qTitles = modal.find('.queryTitles')
                var qHtml =  modal.find('.queryHtml');
                
                this.titleButtons(qTitles, qHtml)
                
                $('.modalMainButton').click(function(e) {
                    rulesModal.submitModalForm(qHtml)
                    
                })
                
            }
        }
        
        
        var workbench = {
            
            getImage : function(data){
                $.post('./', data, function(response){
                    console.log(1)
                    console.log(response)
                    var i = $('<img class="mainImage" src="./'+ response +'"\>')
                    $('.placeholder').remove();
                    i.appendTo('body');
                    rulesModal.start()
                    
                })
            }
        } 
    
        $(document).ready(function(){
            
            $('#urlSubmit').click(function(e){
                e.preventDefault();
                var urlValue = $(e.target).parent().prev().val();
                
                 // validate url
                if(urlValue.length === 0 && URL === urlValue) return false;
                 
                URL = urlValue
                
               
               workbench.getImage({
                   url: URL, 
                   stage: 0, 
                   settings: { width : $('body').width() }
                })
              
            })
            
        })