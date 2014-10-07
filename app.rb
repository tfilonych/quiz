require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database, 'sqlite3:./db/quiz.db'
Dir['./models/*.rb'].each {|file| require file}
enable :sessions
set :session_secret, 'cca369ff55af5ceefc50939498d93f5905272422baf5d86dd0c4271e2e68a9ba'

get '*/js/:filename' do
  content_type 'application/javascript'
  send_file "public/js/#{params[:filename]}"
end

get '/' do
  send_file 'public/index.html'
end

get '/session' do
  return session.inspect
end

post '/register' do
  data = JSON.parse request.body.read
  user = User.new(data)
  if user.save
    return [200, "ok"]
  else
    return [400, user.errors.messages.to_json]
  end
end

get '/access' do
  if session[:user_id]
    user = User.find(session[:user_id])
    return [200, user.username]
  end
  return [401, "unauthorized"]
end

post '/login' do
  data = JSON.parse request.body.read
  user = User.authenticate(data['username'], data['password'])
  if !user.nil?
    if data['remember']
       session[:user_id] = user.id
    end
    return [200, user.username]
  end
    return [401, "unauthorized"]
end

get '/logout' do
  session.clear
  return [200, "ok"]
end

not_found do
  send_file 'public/index.html'
end
