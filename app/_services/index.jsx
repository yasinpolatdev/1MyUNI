import request, { gql } from "graphql-request"

const MASTER_URL="https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/clwg2l7vu02l907w7b936h78g/master"

export const getCourseList=async()=>{
    const query=gql`
    query courseList {
      courseLists(orderBy: publishedAt_DESC) {
        name
        banner {
          url
        }
        free
        id
        author
        totalChapters
        videoId
        tag
        chapter {
          ... on Chapter {
            videoId
            youtubeUrl
            courseContent
          }
        }
      }
    }
     
    `
    const result=await request(MASTER_URL,query);
    return result;
}

export const getCourseById=async(id,userEmail)=>{
  const query=gql`
  query course {
    courseList(where: {id: "`+id+`"}) {
      chapter(first: 40) {
        ... on Chapter {
          id
          name
          chapterNumber
          videoId
          courseContent
          video {
            url
            id
          }
        }
      }
      description
      name
      id
      free
      author
      sourceCode
      demoUrl
      totalChapters
      youtubeUrl
      banner {
        url
      }
    }
    userEnrollCourses(where: {courseId: "`+id+`", userEmail: "`+userEmail+`"}) {
      courseId
      userEmail
      id
      completedChapter {
        ... on CompletedChapter {
          chapterId
        }
      }
    }
  }
  
  
  `

  const result=await request(MASTER_URL,query);
  return result;
}

export const EnrollCourse=async(courseId,userEmail)=>{
  const mutationQuery=gql`
  mutation EnrollCourse {
    createUserEnrollCourse(data: {
      courseList: 
      {connect: {id: "`+courseId+`"}}
      userEmail: "`+userEmail+`", 
      courseId: "`+courseId+`"}) {
      id
    }
  }
  `
  const result=await request(MASTER_URL,mutationQuery);
  return result;
}

export const PublishCourse=async(id)=>{
const mutationQuery=gql`
mutation EnrollCourse {
  publishUserEnrollCourse(where: {id: "`+id+`"})
  {
    id
  }
}
`
const result=await request(MASTER_URL,mutationQuery);
  return result;
}

export const markChapterCompleted=async(recordId,chapterNumber)=>{
  const mutationQuery=gql`
  mutation MarkChapterComplete {
    updateUserEnrollCourse(
      where: {id: "`+recordId+`"}
      data: {completedChapter: {create: {CompletedChapter: 
        {data: {chapterId: "`+chapterNumber+`"}}}}}
    ) {
      id
    }
    publishManyUserEnrollCoursesConnection(to: PUBLISHED) {
      edges {
        node {
          id
        }
      }
    }
  }
  `
  const result=await request(MASTER_URL,mutationQuery);
  return result;
}

export const GetUserCourseList=async(userEmail)=>{
  const query=gql`
  query UserCourseList {
    userEnrollCourses(where: {userEmail: "`+userEmail+`"}) {
      courseList {
        banner {
          url
        }
        description
        name
        id
        free
        sourceCode
        tag
        totalChapters
        author
      }
    }
  }
  `
  const result=await request(MASTER_URL,query);
  return result;

}


