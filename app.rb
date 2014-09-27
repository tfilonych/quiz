require 'sinatra'
require 'sinatra/activerecord'
require 'json'

set :database, 'sqlite3:./db/quiz.db'

class User < ActiveRecord::Base
end

get '*/js/:filename' do
  content_type 'application/javascript'
  send_file "public/js/#{params[:filename]}"
end

get '/' do
  send_file 'public/index.html'
end

not_found do
  send_file 'public/index.html'
end
