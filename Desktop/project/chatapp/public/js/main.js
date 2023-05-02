$(document).ready(function(){
    let messages = [];
    const Socket = io.connect('http://localhost:3000');
    let chat = $('#chatForm');
    let message =$('#chatInput');
    let chatWindow =$('#chatWindow');
    let UserForm = $('#userForm');
    let username =$('#username');
    let users =$('#users');
    let error =$('#error');

//submit user form
    UserForm.on('submit', function(e){
        Socket.emit('set user',username.val(),(data)=>{
            if(data){
                $('#userFormwrap').hide();
                $('#mainWrap').show();
            }else{
                error.html('username is taken');
            }
        });
             
        e.preventDefault();
    });

    chat.on('submit',function(e){
        Socket.emit('send message' ,message.val());
        message.val('');
        e.preventDefault();
    });

    Socket.on('show message',function(data){
        chatWindow.append('<strong>'+data.user+'</strong>:'+data.msg+'<br>')


    });

    Socket.on('users',function(data){
        let html ="";
        for(let i=0;i<data.length;i++){
            html += '<li class="list-group-iteam">'+data[i] +'</li>';
        }
        users.html(html);
    })
});