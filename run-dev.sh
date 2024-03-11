( cd backend ; docker-compose up -d )
( cd backend/ApiServer; dotnet watch ) &
( cd frontend; pnpm dev ) &
wait