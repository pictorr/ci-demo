node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    nodejs('noder'){
    def scannerHome = tool 'lenesu';
    sh 'echo $PATH'
    withSonarQubeEnv() {
      sh "${scannerHome}/bin/sonar-scanner"
    }
   npm install
   npm run prod
}
  }
  stage('New Step') {
    sh 'echo "Hello World"'
  }
}