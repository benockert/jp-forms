deploy-frontend: 
	cd frontend && npm run build && aws s3 sync build/ s3://requests.jaminproductions.com

deploy-backend:
    cd backend && serverless deploy