require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database, 'sqlite3:./db/quiz.db'
enable :sessions
set :session_secret, 'cca369ff55af5ceefc50939498d93f5905272422baf5d86dd0c4271e2e68a9ba'

class User < ActiveRecord::Base
end

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
  user = User.new
  user.username = data['username'] 
  user.first_name = data['first_name']
  user.last_name = data['last_name']
  user.hashed_password = data['password']
  user.email = data['email']
  user.birthday = data['birthday']
  user.plast_hovel = data['plast_hovel']
  user.plast_region = data['plast_region']
  user.plast_level = data['plast_level']
  user.picture = data['picture']
  user.save
  return [200, "ok"]
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
  user = User.where(username: data['username'], hashed_password: data['password']).first 
  if !user.nil?
    session[:user_id] = user.id
    return [200, user.username]
  end
    return [401, "unauthorized"]
end

not_found do
  send_file 'public/index.html'
end
