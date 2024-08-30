import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoadingIndicator from '@components/loadingIndicator/Loader';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES } from '@config/constant';
import ResetPassword from '@views/resetPassword';
import GEGPage from '@views/geg';
import Profile from '@views/profile';
import VerifyEmail from '@views/verifyEmail';
import CMSPage from '@views/CMS/CMSPage';
import ChildResult from '@views/examResults/ChildResult';
import AddEditActivityForm from '@views/activities/AddEditActivity';
import AddEditSeasonalActivityModal from '@views/seasonalTopics/seasonalActivities/AddEditSeasonalActivity';
import ProfilePassword from '@views/profile/ProfilePassword';
import AddEditLessonModal from '@views/lessons/AddEditLesson';
import AddEditSeasonalLessonModal from '@views/seasonalTopics/seasonalLessons/AddEditSeasonalLesson';
import AddEditSchoolModal from '@views/schoolManagement/AddEditSchool';
import AddEditTeacher from '@views/teacherManagement/AddEditTeacher';
import AddEditClassroom from '@views/classroomManagement/AddEditClassroom';
import AddEditStudent from '@views/studentManagement/AddEditStudent';
import ClassroomProgress from '@views/classroomManagement/classroomProgress';
import VideoPage from '@views/videoManagement/video';
import ResetChildPassword from '@views/childResetPassword';

// Containers
const DefaultLayout = React.lazy(() => import('@layout/DefaultLayout'));
const PublicLayout = React.lazy(() => import('@layout/PublicLayout'));
const NotFound = React.lazy(() => import('@views/404'));
const Dashboard = React.lazy(() => import('@views/dashboard'));
const Login = React.lazy(() => import('@views/login'));
const ForgotPassword = React.lazy(() => import('@views/forgotPassword'));
const SubAdmin = React.lazy(() => import('@views/subAdmin'));
const State = React.lazy(() => import('@views/countryManagement'));
const CMSList = React.lazy(() => import('@views/CMS'));
const Settings = React.lazy(() => import('@views/settingsPage'));
const UserManagement = React.lazy(() => import('@views/userManagement'));
const Topic = React.lazy(() => import('@views/topics'));
const Lessons = React.lazy(() => import('@views/lessons'));
const Onboarding = React.lazy(() => import('@views/onBoarding'));
const SopLevel = React.lazy(() => import('@views/signOnPlacement'));
const SopActivities = React.lazy(() => import('@views/signOnPlacement/sopActivities'));
const AddEditSopActivityForm = React.lazy(() => import('@views/signOnPlacement/sopActivities/AddEditActivity'));
const ExamResults = React.lazy(() => import('@views/examResults'));
const Levels = React.lazy(() => import('@views/levelManagement'));
const Activities = React.lazy(() => import('@views/activities'));
const Subscription = React.lazy(() => import('@views/subscriptionManagement'));
const RolePermissions = React.lazy(() => import('@views/rolePermissions'));
const PetStore = React.lazy(() => import('@views/petStoreManagement'));
const UserPermissions = React.lazy(() => import('@views/userPermissions'));
const SeasonalTopics = React.lazy(() => import('@views/seasonalTopics'));
const SeasonalLessons = React.lazy(() => import('@views/seasonalTopics/seasonalLessons'));
const SeasonalActivities = React.lazy(() => import('@views/seasonalTopics/seasonalActivities'));
const FlashCardCategories = React.lazy(() => import('@views/flashCard'));
const FlashCard = React.lazy(() => import('@views/flashCard/addFlashCard'));
const WhyItWorks = React.lazy(() => import('@views/whyItWorks'));
const Sound = React.lazy(() => import('@views/soundManagement'));
const Vocabularies = React.lazy(() => import('@views/vocabularies'));
const ContactUs = React.lazy(() => import('@views/contactUs'));
const Schools = React.lazy(() => import('@views/schoolManagement'));
const Teachers = React.lazy(() => import('@views/teacherManagement'));
const Classrooms = React.lazy(() => import('@views/classroomManagement'));
const Students = React.lazy(() => import('@views/studentManagement'));
const Videos = React.lazy(() => import('@views/videoManagement'));

function App() {
	return (
		<>
			<ToastContainer />
			<Suspense fallback={<LoadingIndicator />}>
				<Routes>
					{/* Public routes */}
					<Route element={<PublicLayout />}>
						<Route path={ROUTES.login} element={<Login />} />
						<Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
						<Route path={`${ROUTES.resetPassword}`} element={<ResetPassword />} />
						<Route path={`${ROUTES.resetPassword}/${ROUTES.child}`} element={<ResetChildPassword />} />
						<Route path='' element={<Navigate to={`/${ROUTES.login}`} />} />
					</Route>
					{/* Private routes */}
					<Route path={ROUTES.app} element={<DefaultLayout />}>
						<Route index element={<Dashboard />} />
						<Route path={ROUTES.dashboard} element={<Dashboard />} />
						<Route path={ROUTES.app} element={<Navigate to={`/${ROUTES.app}/${ROUTES.login}`} />} />
						<Route path={`${ROUTES.subAdmin}/${ROUTES.list}`} element={<SubAdmin />} />
						<Route path={`${ROUTES.state}/${ROUTES.list}`} element={<State />} />
						<Route path={`${ROUTES.CMS}/${ROUTES.list}`} element={<CMSList />} />
						<Route path={`${ROUTES.settings}`} element={<Settings />} />
						<Route path={`${ROUTES.user}/${ROUTES.list}`} element={<UserManagement />} />
						<Route path={ROUTES.role} element={<RolePermissions />} />
						<Route path={ROUTES.profile} element={<Profile />} />
						<Route path={ROUTES.profilePassword} element={<ProfilePassword />} />
						<Route path={`${ROUTES.onboarding}/${ROUTES.list}`} element={<Onboarding />} />
						<Route path={`${ROUTES.signOnPlacement}/${ROUTES.list}`} element={<SopLevel />} />
						<Route path={`${ROUTES.sopActivities}/${ROUTES.list}/:levelId/:levelName`} element={<SopActivities />} />
						<Route path={`${ROUTES.sopActivities}/${ROUTES.list}/:levelId/:levelName/signOnPlacementActivity`} element={<AddEditSopActivityForm />} />
						<Route path={`${ROUTES.sopActivities}/${ROUTES.list}/:levelId/:levelName/signOnPlacementActivity/:activityTypeId/:activityId`} element={<AddEditSopActivityForm />} />
						<Route path={`${ROUTES.examResults}/${ROUTES.list}`} element={<ExamResults />} />
						<Route path={`${ROUTES.examResults}/${ROUTES.list}/:parentId/:childId`} element={<ChildResult />} />
						<Route path={`${ROUTES.level}/${ROUTES.list}`} element={<Levels />} />
						<Route path={`${ROUTES.topic}/${ROUTES.list}/:levelId/:levelName`} element={<Topic />} />
						<Route path={`${ROUTES.lessons}/${ROUTES.list}/:levelId/:topicId/:levelName/:topicName`} element={<Lessons />} />
						<Route path={`${ROUTES.lessons}/${ROUTES.list}/:levelId/:topicId/:levelName/:topicName/lesson`} element={<AddEditLessonModal />} />
						<Route path={`${ROUTES.lessons}/${ROUTES.list}/:levelId/:topicId/:levelName/:topicName/lesson/:lessonId`} element={<AddEditLessonModal />} />
						<Route path={`${ROUTES.activities}/${ROUTES.list}/:levelId/:topicId/:lessonId/:levelName/:topicName/:lessonName`} element={<Activities />} />
						<Route path={`${ROUTES.activities}/${ROUTES.list}/:levelId/:topicId/:lessonId/:levelName/:topicName/:lessonName/activity`} element={<AddEditActivityForm />} />
						<Route path={`${ROUTES.activities}/${ROUTES.list}/:levelId/:topicId/:lessonId/:levelName/:topicName/:lessonName/activity/:activityTypeId/:activityId`} element={<AddEditActivityForm />} />
						<Route path={`${ROUTES.subscription}/${ROUTES.list}`} element={<Subscription />} />
						<Route path={`${ROUTES.petStore}/${ROUTES.list}`} element={<PetStore />} />
						<Route path={ROUTES.userPermissions} element={<UserPermissions />} />
						<Route path={`${ROUTES.seasonalTopic}`} element={<SeasonalTopics />} />
						<Route path={`${ROUTES.seasonalLesson}/${ROUTES.list}/:topicId/:topicName`} element={<SeasonalLessons />} />
						<Route path={`${ROUTES.seasonalLesson}/${ROUTES.list}/:topicId/:topicName/seasonalLesson`} element={<AddEditSeasonalLessonModal />} />
						<Route path={`${ROUTES.seasonalLesson}/${ROUTES.list}/:topicId/:topicName/seasonalLesson/:lessonId`} element={<AddEditSeasonalLessonModal />} />
						<Route path={`${ROUTES.seasonalActivities}/${ROUTES.list}/:topicId/:lessonId/:topicName/:lessonName`} element={<SeasonalActivities />} />
						<Route path={`${ROUTES.seasonalActivities}/${ROUTES.list}/:topicId/:lessonId/:topicName/:lessonName/seasonalActivity`} element={<AddEditSeasonalActivityModal />} />
						<Route path={`${ROUTES.seasonalActivities}/${ROUTES.list}/:topicId/:lessonId/:topicName/:lessonName/seasonalActivity/:activityTypeId/:activityId`} element={<AddEditSeasonalActivityModal />} />
						<Route path={`${ROUTES.flashCard}`} element={<FlashCardCategories />} />
						<Route path={`${ROUTES.flashCardList}/:id`} element={<FlashCard />} />
						<Route path={`${ROUTES.whyItWorks}/${ROUTES.list}`} element={<WhyItWorks />} />
						<Route path={`${ROUTES.sound}/:id`} element={<Sound />} />
						<Route path={`${ROUTES.vocabularies}/${ROUTES.list}`} element={<Vocabularies />} />
						<Route path={`${ROUTES.contactUs}/${ROUTES.list}`} element={<ContactUs />} />
						<Route path={`${ROUTES.school}/${ROUTES.list}`} element={<Schools />} />
						<Route path={`${ROUTES.school}/${ROUTES.list}/addSchool`} element={<AddEditSchoolModal />} />
						<Route path={`${ROUTES.school}/${ROUTES.list}/editSchool/:schoolId`} element={<AddEditSchoolModal />} />
						<Route path={`${ROUTES.school}/${ROUTES.list}/viewSchool/:viewId`} element={<AddEditSchoolModal />} />
						<Route path={`${ROUTES.teacher}/${ROUTES.list}/:schoolId?`} element={<Teachers />} />
						<Route path={`${ROUTES.teacher}/${ROUTES.list}/:schoolId?/addTeacher`} element={<AddEditTeacher />} />
						<Route path={`${ROUTES.teacher}/${ROUTES.list}/:schoolId?/editTeacher/:teacherId`} element={<AddEditTeacher />} />
						<Route path={`${ROUTES.teacher}/${ROUTES.list}/:schoolId?/viewTeacher/:viewId`} element={<AddEditTeacher />} />
						<Route path={`${ROUTES.classroom}/${ROUTES.list}`} element={<Classrooms />} />
						<Route path={`${ROUTES.classroom}/${ROUTES.list}/:schoolId/addClass`} element={<AddEditClassroom />} />
						<Route path={`${ROUTES.classroom}/${ROUTES.list}/:schoolId/:teacherId/editClass/:classId`} element={<AddEditClassroom />} />
						<Route path={`${ROUTES.classroom}/${ROUTES.list}/:schoolId/:teacherId/viewClass/:viewId/:className`} element={<ClassroomProgress />} />
						<Route path={`${ROUTES.student}/${ROUTES.list}`} element={<Students />} />
						<Route path={`${ROUTES.student}/${ROUTES.list}/addStudent`} element={<AddEditStudent />} />
						<Route path={`${ROUTES.student}/${ROUTES.list}/editStudent/:studentId`} element={<AddEditStudent />} />
						<Route path={`${ROUTES.student}/${ROUTES.list}/viewStudent/:viewId`} element={<AddEditStudent />} />
						<Route path={`${ROUTES.videos}/${ROUTES.list}`} element={<Videos />} />
					</Route>
					<Route path={ROUTES.geg} element={<GEGPage />} />
					<Route path={`${ROUTES.app}/${ROUTES.videos}/${ROUTES.view}/:slug`} element={<VideoPage />} />
					<Route path={`${ROUTES.pages}/:slug`} element={<CMSPage />} />
					<Route path='*' element={<NotFound />} />
					<Route path={`${ROUTES.authentication}/${ROUTES.verifyEmail}`} element={<VerifyEmail />} />
				</Routes>
			</Suspense>
		</>
	);
}

export default App;
