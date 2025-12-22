#!/bin/bash
# Quick setup script to push images to Docker Hub

set -e

echo "🚀 Docker Hub Setup Script"
echo ""
echo "Enter your Docker Hub username:"
read -r USERNAME

echo ""
echo "Logging in to Docker Hub..."
docker login -u "$USERNAME"

echo ""
echo "Tagging images..."
docker tag azureg4cicd-backend:latest "$USERNAME/azureg4cicd-backend:latest"
docker tag azureg4cicd-frontend:latest "$USERNAME/azureg4cicd-frontend:latest"

echo ""
echo "Pushing Backend image..."
docker push "$USERNAME/azureg4cicd-backend:latest"

echo ""
echo "Pushing Frontend image..."
docker push "$USERNAME/azureg4cicd-frontend:latest"

echo ""
echo "✅ Images pushed successfully!"
echo ""
echo "Update GitHub Secrets with:"
echo "  DOCKERHUB_USERNAME: $USERNAME"
echo "  DOCKERHUB_TOKEN: <your-access-token>"
echo ""
echo "Get your token from: https://hub.docker.com/settings/security"
