import * as Yup from 'yup';
import useCommonValidationFields from '@framework/hooks/validations/common';
import useValidationFields from '@framework/hooks/validations/fields';
import { validationProps } from 'src/types/common';


const useValidation = () => {
	const { email, password, firstName, lastName, status, endDate, startDate, address, image, title, contactNo, countryID, confirmPasswordCommon,chapterName } = useCommonValidationFields();
	const { categorSuggestion, oldPassword, BannerImage, companyId, capture_rate, performance_current, performance_potential, newPassword, attachment, selectLocation, confirmPassword, metaTitleEnglish, descriptionEnglish, metaDescriptionEnglish, categoryId, categoryDescription, suggestion, fromUserId, rating, review, toUserId, name, countryCode, stateName, stateCode, countryId, cityName, cityCountryId, stateId, topicId, questionEnglish, answerEnglish, enquirename, message, subject, siteName, tagLine, appLanguage, logo, description, eventName, template, BannerTitle, ruleName, descriptionenter, priority, onAction, role, couponName, couponCode, percentage, startTime, expireTime, selectedUsers, couponType, isReusable, applicable, dateOfBirth, gender, userName, contentpagetitle, supportEmail, contactEmail, contactNumber, suggestionstatus, oldPasswordsubadmin, newPasswordsubadmin, announcementType, parentCategory, planstatus, planstatusmonths, subscribedcompany, SubscribercountryCode, technicalName, technicalImageUrl, technicalDescription, technicalParentId, highlights1, highlights2, highlights3, highlights4, courseTitle,  prerequisite, qualification, instructorName, category, subCategory, courseDescription,  instructorProfilePreview, courseImagePreview, bannerImagePreview, answer, question, url, youtubeUrl, lessonImage, selectQuizTime, enterPassingCriterion, enterQuestion, optionAnswer1, optionAnswer2, optionAnswer3, optionAnswer4, selectedAnswerOption, companyDescription, companyEmail, companyImage, companyLocation, companyName, companyWebsiteUrl, userManualName, userOldPassword, userNewPassword, userConfirmPassword, UserFirstName, UserLastName, role_id, reporting_manager_id, TenantCompanyName, TenantDescription, TenantFirstName, TenantLastName, TenantPositionName, category_main_id, fileUploading, imageUploading, company_sub_admin, locationCrud, city, locationlist, subscriber_id, AuthorizedPersonId,
		titleWebsite, subTitleWebsite, serviceDescription, serviceImage, serviceTitle,
		aboutTitle, aboutDescription, aboutCheckPointTitle, ClientImage, WasteTitle, WasteMangeTitle, WasteMangeDescription, WasteMangeImage, rateTitle, rateDescription, WhyChooseTitle, WhyChooseDescription, WhyChooseImage, aboutCourseTitle, aboutCourseDescription, aboutCourseCheckPoint, testimonialTitle, testimonialName, testimonialDescription, testimonialImage, testimonialTag, subscriptionTitle, subPlanName, subPlanPrice, pointTitle, tagTitle, tagDescription, tagType, selectedDate, cityCrud, companyBranchId, branchLocationId, zone, siteId, volumeTitle, volumeCubicYard, equipmentName, volumeId, materialCategory, materialDetails, frequency, frequencyType, diversionUserId, locationId, materialId,
		materialTypeId, equipmentId, serviceType, end_date, end_month, frequency_setting, start_date, start_month, createReport_userId, add_units, createReport_frequency, createReport_zoneId,
		weightZoneId, weightServiceType, weightMaterial_id, weightMaterial_type_id,  weightfrequencyId, weightaddUnits, weightLifts,  weightapproxWeightperUnit, weightapproxWeightperMonth,
		reportDataLifts,  reportService, reportequip, reportWeight, reportdate, contractorValidation, volumeDrp,locationCourseId,employeeId ,option,file,correctAnswer,media,minutes,hours} = useValidationFields();

	const loginValidationSchema = Yup.object({
		email: email,
		password: password,
	});

	const userDetails = Yup.object({
		/*// pronounce: pronounce,*/
		first_name: firstName,
		last_name: lastName,
		email: email,
		role_id: role_id,
		country_code: countryID,
		phone_number: contactNo,
		// preferred_language: appLanguage,
	});

	const employeeDetails = Yup.object({
		// department: department,
		isSubAdmin: company_sub_admin,
		// position: title_position,
		branchId: branchLocationId,
		reporting_manager_id: Yup.string().when('isSubAdmin', {
			is: false,
			then: reporting_manager_id,
		}),
	});


	const updateUserValidationSchema = Yup.object({
		logo: logo,
		first_name: firstName,
		last_name: lastName,
		email: email,
		country_code: countryID,
		mobile_number: contactNo,
		// branch_id: location,
		// branch_id:branchId,
		role: role_id,
		// preferredLanguage: appLanguage,
		// department: department,
		reportingManager: Yup.string().when('isReportingManager', {
			is: true,
			then: reporting_manager_id,
		}),
	});

	const planYourCourseValidationSchema = Yup.object({
		highlights1: highlights1,
		highlights2: highlights2,
		highlights3: highlights3,
		highlights4: highlights4,
		courseTitle: courseTitle,
		addPrerequisite: Yup.boolean(),
		prerequisite: Yup.string().when('addPrerequisite', {
			is: true,
			then: prerequisite,
		}),
		instructorName: instructorName,
		category: category,
		courseDescription: courseDescription,
		qualification: qualification,
		courseImageUploadFileName: courseImagePreview,
		instructorImageUploadFileName: instructorProfilePreview,
		bannerImageUploadFileName: bannerImagePreview
	});

	const courseTitleValidationSchema = Yup.object({
		courseTitle: courseTitle
	});

	const createInvoiceSchema = Yup.object({
		title: title,
		attachments: attachment,
		branchId: selectLocation,
		selectedDate: selectedDate
	});
	const requestReportSchema = Yup.object({
		branchId: selectLocation,
		companyId: companyId,
	});
	const createWasteAuditSchema = Yup.object({
		attachment: attachment,
		branch_id: selectLocation,
		highlight_1: highlights1,
		highlight_2: highlights2,
		highlight_3: highlights3,
		performance_capture_rate: capture_rate,
		performance_current: performance_current,
		performance_potential: performance_potential,
		title: title,
		date: selectedDate,
	});
	const createUpdateEmailSchema = Yup.object({
		title: title,
		description: description,
		status: status,
	});
	const createQuizValidationSchema = Yup.object({
		quizCheckbox: Yup.boolean(),
		applyTimerCheckbox: Yup.boolean(),
		enterQuestion: Yup.string().when('quizCheckbox', {
			is: true,
			then: enterQuestion,
		}),
		optionAnswer1: Yup.string().when('quizCheckbox', {
			is: true,
			then: optionAnswer1,
		}),
		optionAnswer2: Yup.string().when('quizCheckbox', {
			is: true,
			then: optionAnswer2,
		}),
		optionAnswer3: Yup.string().when('quizCheckbox', {
			is: true,
			then: optionAnswer3,
		}),
		optionAnswer4: Yup.string().when('quizCheckbox', {
			is: true,
			then: optionAnswer4,
		}),
		selectedAnswerOption: Yup.string().when('quizCheckbox', {
			is: true,
			then: selectedAnswerOption,
		}),
		enterPassingCriterion: Yup.string().when('applyTimerCheckbox', {
			is: true,
			then: enterPassingCriterion,
		}),
		selectQuizTime: Yup.string().when('applyTimerCheckbox', {
			is: true,
			then: selectQuizTime,
		}),
	});
	const createYourContentValidationSchema = Yup.object().shape({
		chapters: Yup.array().of(
			Yup.object().shape({
				// name: title,
				lessons: Yup.array().of(
					Yup.object().shape({
						title: title,
						// attachment: attachment,
						video_url: youtubeUrl,
						image: lessonImage,
						url: url,
					})
				),
			})
		),
	});
	const zoneManagementValidationSchema = Yup.object().shape({
		siteId: siteId,
		existingZones: Yup.array().of(
			Yup.object().shape({
				name: zone,
				// diversion_percentage:diversionPercentage,
			})
		)
		// .test('sum','Total diversion percentage must be equal to 100',(values :unknown )=>{
		// 	const sum =
		// 	(values as existingZones[])?.reduce((sum :number, currentValue:existingZones) => {
		// 		return sum + (+currentValue?.diversion_percentage);
		// 	}, 0) || 0;
		// 	return Number(Math.round(sum).toFixed(2)) === 100;	
		// })
	})

	const createCustomerTicket = Yup.object().shape({
		attachments: attachment,
		first_name: firstName,
		last_name: lastName,
		phone_number: contactNo,
		email: email,
		message: message,
	});
	const addFAQValidationSchema = Yup.object({
		question: question,
		answer: answer,
	});
	const suadminpasswordValidationSchema = Yup.object({
		oldPassword: oldPasswordsubadmin,
		newPassword: newPasswordsubadmin,
	});

	const changeProfileValidationSchema = Yup.object({
		oldPassword: oldPassword,
		newPassword: newPassword,
		confirmPassword: confirmPassword,
	});

	const updateAdminValidationSchema = Yup.object({
		firstName: firstName,
		lastName: lastName,
	});

	const addEditCmsValidationSchema = Yup.object({
		titleEnglish: contentpagetitle,
		metaTitleEnglish: metaTitleEnglish,
		descriptionEnglish: descriptionEnglish,
		metaDescriptionEnglish: metaDescriptionEnglish,
	});

	const addSuggestionValidationSchema = Yup.object({
		categoryId: categorSuggestion,
		suggestion: suggestion,
		status: suggestionstatus,
	});

	const addReviewValidationsSchema = Yup.object({
		fromUserId: fromUserId,
		toUserId: toUserId,
		rating: rating,
		review: review,
	});

	const addcountryValidationSchema = Yup.object({
		name: name,
		countryCode: countryCode,
		status: status,
	});

	const addstateValidationSchema = Yup.object({
		name: stateName,
		stateCode: stateCode,
		status: status,
		countryId: countryId,
	});

	const addcityValidationSchema = Yup.object({
		cityName: cityName,
		countryId: cityCountryId,
		stateId: stateId,
	});

	const addFaqValidationSchema = Yup.object({
		topicId: topicId,
		questionArabic: questionEnglish,
		questionEnglish: questionEnglish,
		questionHindi: questionEnglish,
		answerEnglish: answerEnglish,
		answerArabic: answerEnglish,
		answerHindi: answerEnglish,
		status: status,
	});
	const addEnquireValidationSchema = Yup.object({
		name: enquirename,
		message: message,
		subject: subject,
		status: status,
		email: email,
	});
	const addSettingValidationSchema = Yup.object({
		siteName: siteName,
		tagLine: tagLine,
		supportEmail: supportEmail,
		contactEmail: contactEmail,
		contactNo: contactNumber,
		appLanguage: appLanguage,
		address: address,
		logo: logo,
		favicon: logo,
	});

	const addEventValidationSchema = Yup.object({
		eventName: eventName,
		description: description,
		startDate: startDate,
		endDate: endDate,
		address: address,
	});
	const addManageSubCategoryValidationSchema = Yup.object({
		categoryName: categoryId,
		status: status,
		description: categoryDescription,
		parentCategory: parentCategory,
	});

	const addManageCategoryValidationSchema = Yup.object({
		categoryName: categoryId,
		description: categoryDescription,
		status: status,
	});

	const addNotificationValidationSchema = Yup.object({
		template: template,
	});

	const manageRuleSetValidationsSchema = Yup.object({
		ruleName: ruleName,
		description: descriptionenter,
		priority: priority,
		onAction: onAction,
	});

	const addAnnouncementValidationSchema = Yup.object({
		announcementType: announcementType,
		title: title,
		description: description,
		pushImage: image,
	});

	const addRoleValidationSchema = Yup.object({
		role: role,
	});

	const addCoupenValidationSchema = Yup.object({
		couponName: couponName,
		couponCode: couponCode,
		percentage: percentage,
		startTime: startTime,
		expireTime: expireTime,
		selectedUsers: selectedUsers,
		couponType: couponType,
		isReusable: isReusable,
		applicable: applicable,
	});

	const forgotPasswordValidationSchema = Yup.object({
		email: email,
	});

	const resetPasswordValidationSchema = Yup.object({
		password: password,
		confirmPassword: password,
	});

	const usermValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			firstName: firstName,
			lastName: lastName,
			phoneNo: contactNo,
			gender: gender,
			dateOfBirth: dateOfBirth,
			userName: userName,
			email: email,
			profileImg: logo,
			...(params !== undefined
				? {}
				: {
					password: password,
					confirmPassword: confirmPasswordCommon,
				}),
		});
	};

	const BannerValidationSchema = () => {
		return Yup.object({
			BannerTitle: BannerTitle,
			status: status,
			bannerImage: BannerImage,
		});
	};
	const subAdminValidationSchema = ({ params }: validationProps) => {
		return Yup.object({
			email: email,
			role: role,
			userName: userName,
			firstName: firstName,
			lastName: lastName,
			...(params !== undefined
				? {}
				: {
					password: password,
					confirmPassword: confirmPasswordCommon,
				}),
		});
	};

	const addSubscriberValidationSchema = Yup.object({
		firstName: firstName,
		lastName: lastName,
		Email: email,
		SubscribedCompany: subscribedcompany,
		PhoneNumber: contactNo,
		StartDate: startDate,
		status: planstatus,
		SubscribedPlan: planstatusmonths,
		countryCode: SubscribercountryCode,
		Address: address,
		location: locationlist,
		city: city,
		branches: Yup.array().of(
			Yup.object().shape({
				uuid: Yup.string(),
				location: Yup.string(),
				city: Yup.string(),
			})
		).min(1, 'At least one location is required'),
		subscriber_id: subscriber_id
	});

	const addUserManualValidationSchema = Yup.object({
		name: userManualName,
		category_id: subCategory,
		url: fileUploading,
		category_main_id: category_main_id,
		file_foreground_image: imageUploading
	});

	const addTechnicalManualValidationSchema = Yup.object({
		name: technicalName,
		image_url: technicalImageUrl,
		description: technicalDescription,

	});
	const addTechnicalManualChildValidationSchema = Yup.object({
		name: technicalName,
		image_url: technicalImageUrl,
		description: technicalDescription,
		parent_id: technicalParentId,

	});

	const addLocationSchema = Yup.object({
		location: locationCrud,
		city: cityCrud,
	});
	const addCompanyValidationSchema = Yup.object({
		country_id: countryID,
		description: companyDescription,
		email: companyEmail,
		location: companyLocation,
		name: companyName,
		phone_number: contactNo,
		website_url: companyWebsiteUrl,
		image_url: companyImage,

	});

	const addSubscriberCompanyValidationSchema = Yup.object({
		country_id: SubscribercountryCode,
		description: companyDescription,
		email: companyEmail,
		name: companyName,
		phone_number: contactNo,
		website_url: companyWebsiteUrl
	});
	const changePasswordValidationSchema = Yup.object({
		oldPassword: userOldPassword,
		newPassword: userNewPassword,
		confirmPassword: userConfirmPassword,
	});

	const changeProfileDetailsValidationSchema = Yup.object({
		first_name: UserFirstName,
		last_name: UserLastName,
		country_code: countryID,
		phone_number: contactNo,
	});

	const companyOrTenantDetailsSchema = Yup.object({
		name: TenantCompanyName,
		description: TenantDescription,
		company_branch_id: companyBranchId,
	})
	const companyOrTenantDetailsPageSchema = Yup.object({
		position: TenantPositionName,
		phone_number: contactNo,
		last_name: TenantLastName,
		first_name: TenantFirstName,
		email: email,
		country_id: countryID,
	})
	const authorizedPersonSchema = Yup.object({
		authorized_person_id: AuthorizedPersonId,
	})
	const contractorDetailsSchema = Yup.object({
		name: TenantCompanyName,
		// industry_type_id: TenantIndustryType,
		description: TenantDescription,
		company_branch_id: companyBranchId,
	})
	const changeTitleSubTitle = Yup.object({
		title: titleWebsite,
		subtitle: subTitleWebsite

	})

	const changeServicesValidationSchema = Yup.object().shape({
		services: Yup.array().of(
			Yup.object().shape({
				description: serviceDescription,
				image: serviceImage,
				title: serviceTitle,
			})
		),
	});

	const changeAboutUsValidationSchema = Yup.object().shape({
		title: aboutTitle,
		description: aboutDescription,
		image: youtubeUrl,
		about: Yup.array().of(
			Yup.object().shape({
				title: aboutCheckPointTitle,
			})
		),
	});

	const ClientValidationSchema = Yup.object().shape({
		manageClient: Yup.array().of(
			Yup.object().shape({
				image: ClientImage,
			})
		),
	});

	const wasteCollectionValidationSchema = Yup.object().shape({
		title: WasteTitle,
		description: subTitleWebsite,
		landing_page_services: Yup.array().of(
			Yup.object().shape({
				title: WasteMangeTitle,
				description: WasteMangeDescription,
				image: WasteMangeImage,
			})
		),
	});

	const ratingValidationSchema = Yup.object().shape({
		rating: Yup.array().of(
			Yup.object().shape({
				title: rateTitle,
				description: rateDescription,

			})
		),
	});

	const whyChooseValidationSchema = Yup.object().shape({
		title: WhyChooseTitle,
		description: WhyChooseDescription,
		image: WhyChooseImage,
	});

	const aboutCourseValidationSchema = Yup.object().shape({
		title: aboutCourseTitle,
		description: aboutCourseDescription,
		aboutCoursePoint: Yup.array().of(
			Yup.object().shape({
				title: aboutCourseCheckPoint,

			})
		),
	});

	const testimonialValidationSchema = Yup.object().shape({
		title: testimonialTitle,
		landing_page_testimonials: Yup.array().of(
			Yup.object().shape({
				name: testimonialName,
				description: testimonialDescription,
				image: testimonialImage,
				tag: testimonialTag,

			})
		),
	});

	const planValidationSchema = Yup.object().shape({
		title: subscriptionTitle,
		subscription_plans: Yup.array().of(
			Yup.object().shape({
				name: subPlanName,
				price: subPlanPrice,
				subscription_plan_points: Yup.array().of(
					Yup.object().shape({
						title: pointTitle,
					})
				),
			})
		),
	});

	const tagValidationSchema = Yup.object().shape({
		type: Yup.array().of(
			Yup.object().shape({
				title: tagTitle,
				description: tagDescription,
				type: tagType

			})
		),
	});
	const changePasswordSubscriberValidationSchema = Yup.object({
		newPassword: userNewPassword,
		confirmPassword: userConfirmPassword,
	});

	const createVolumeValidationSchema = Yup.object({
		volumeData: Yup.object().shape({
			volume: volumeTitle,
			volume_cubic_yard: volumeCubicYard,
		})
	});

	const createEquipmentValidationSchema = Yup.object({
		equipmentData: Yup.object().shape({
			name: equipmentName,
			volumeId: volumeId,
		})
	});

	const createMaterialValidationSchema = Yup.object({
		materialData: Yup.object().shape({
			name: materialCategory,
			materialDetails: materialDetails,
		})
	});

	const createFrequencyValidationSchema = Yup.object({
		frequencyData: Yup.object().shape({
			frequency: frequency,
			frequency_type: frequencyType,
		})
	});

	const diversionReportValidationSchema = Yup.object({
		diversionReportTemplateData: Yup.object().shape({
			// equipment_id: equipmentId,
			// location_id: locationId,
			material_id: materialId,
			material_type_id: materialTypeId,
			service_type: serviceType,
			volume_name: volumeDrp,
			equipment:equipmentId
		})
	});

	const diversionSettingsValidationSchema = Yup.object({
		diversionSettingsData: Yup.object().shape({
			end_date: end_date,
			end_month: end_month,
			frequency: frequency_setting,
			// location_id: location_id,
			start_date: start_date,
			start_month: start_month
		})
	})
	const updateDiversionAdminValidationSchema = Yup.object({
		diversionAdminData: Yup.object().shape({
			location_id: locationId,
			user_id: diversionUserId
		})
	})
	const createDiversionReportValidationSchema = Yup.object({
		user_id: createReport_userId,
		serviceData: Yup.array().of(
			Yup.object().shape({
				add_units: add_units,
				frequency_id: createReport_frequency,
				zone_id: createReport_zoneId,
			}))
	})


	const createOrUpdateWeightsValidationSchema = Yup.object().shape({
		zone_id: weightZoneId,
		service_type: weightServiceType,
		material_id: weightMaterial_id,
		material_type_id: weightMaterial_type_id,
		// equipment_id: weightEquipmentId,
		equipment: equipmentId,
		// volume_id: weightVolumeId,
		frequency_id: weightfrequencyId,
		add_units: weightaddUnits,
		lifts: weightLifts,
		// volume: weightVolume,
		// approx_weight_per_unit: weightapproxWeightperUnit,
		
		// approx_weight_per_month: weightapproxWeightperMonth,
		volume_name:volumeDrp,
	})
	const historydiversionReport = Yup.object().shape({
		zone_id: weightZoneId,
		service_type: weightServiceType,
		material_id: weightMaterial_id,
		material_type_id: weightMaterial_type_id,
		// equipment_id: weightEquipmentId,
		// volume_id: weightVolumeId,
		frequency_id: weightfrequencyId,
		add_units: weightaddUnits,
		lifts: weightLifts,
		// volume: weightVolume,
		approx_weight_per_unit: weightapproxWeightperUnit
		,
		approx_weight_per_month: weightapproxWeightperMonth,
		compactor_lifts: Yup.array().of((Yup.object().shape({
			date: reportdate,
			weight: reportWeight
		}))),
		equipment: equipmentId,
		volume_name:volumeDrp,
	})
	const historyNewdiversionReport = Yup.object().shape({
		zone_id: weightZoneId,
		service_type: weightServiceType,
		material_id: weightMaterial_id,
		material_type_id: weightMaterial_type_id,
		// equipment_id: weightEquipmentId,
		// volume_id: weightVolumeId,
		company_id: contractorValidation,
		frequency_id: weightfrequencyId,
		add_units: weightaddUnits,
		lifts: weightLifts,
		// volume: weightVolume,
		approx_weight_per_unit: weightapproxWeightperUnit
		,
		approx_weight_per_month: weightapproxWeightperMonth,
		compactor_lifts: Yup.array().of((Yup.object().shape({
			date: reportdate,
			weight: reportWeight
		}))),
		equipment: equipmentId,
		volume_name:volumeDrp,

	})


	const weightsTableValidationschema = Yup.object().shape({
		reportData: Yup.array().of(Yup.object().shape({
			lifts: reportDataLifts,
			// approx_weight_per_month: reportApproxWeightpermonth,
			service_type: reportService,
			equipment: reportequip
		})),
		popupData: Yup.array().of((Yup.object().shape({
			date: reportdate,
			weight: reportWeight
		})))
	})

	const createOrUpdateCourseCreator=Yup.object().shape({
		courseCreatorData:Yup.object().shape({
			user_id:employeeId,
			locations:Yup.array().of((Yup.object().shape({
				location_id:locationCourseId,
			})))
		})
	});

	const createOrUpdateCourseAdmin=Yup.object().shape({
		courseAdminData:Yup.object().shape({
			user_id:employeeId,
			locations:Yup.array().of((Yup.object().shape({
				location_id:locationCourseId,
			})))
		})
	});

	const QuizValidationSchema = Yup.object().shape({
		chapterName:chapterName,
		selectedQuestions:Yup.object({
			question: question,
            options: Yup.array().of((
				Yup.object().shape({
					option: option
				})
			))			
		}),
		correctAnswer:correctAnswer
		
	});

	const PDFTypeValidationSchema = Yup.object().shape({
		chapterName: chapterName,
        fileName: file,
	});

	const TextBasedValidationSchema = Yup.object().shape({
		chapterName:chapterName,
        text: media,
	})

	const YoutubeBasedValidationSchema = Yup.object().shape({
		chapterName:chapterName,
        chapterImage: lessonImage,
        youtubeUrl: youtubeUrl,
	})

	const PublishCourseSchema =Yup.object().shape({
		minutes:minutes,
		hours:hours,
	})

	return {
		tagValidationSchema,
		planValidationSchema,
		testimonialValidationSchema,
		aboutCourseValidationSchema,
		whyChooseValidationSchema,
		ratingValidationSchema,
		wasteCollectionValidationSchema,
		ClientValidationSchema,
		changeAboutUsValidationSchema,
		changeServicesValidationSchema,
		changeTitleSubTitle,
		loginValidationSchema,
		requestReportSchema,
		createCustomerTicket,
		createUpdateEmailSchema,
		createWasteAuditSchema,
		planYourCourseValidationSchema,
		courseTitleValidationSchema,
		createQuizValidationSchema,
		addFAQValidationSchema,
		createYourContentValidationSchema,
		changeProfileValidationSchema,
		updateAdminValidationSchema,
		addEditCmsValidationSchema,
		addSuggestionValidationSchema,
		addReviewValidationsSchema,
		addcountryValidationSchema,
		addstateValidationSchema,
		addcityValidationSchema,
		addFaqValidationSchema,
		addEnquireValidationSchema,
		addSettingValidationSchema,
		addEventValidationSchema,
		addManageCategoryValidationSchema,
		addManageSubCategoryValidationSchema,
		addNotificationValidationSchema,
		manageRuleSetValidationsSchema,
		addAnnouncementValidationSchema,
		addRoleValidationSchema,
		addCoupenValidationSchema,
		forgotPasswordValidationSchema,
		resetPasswordValidationSchema,
		usermValidationSchema,
		BannerValidationSchema,
		subAdminValidationSchema,
		suadminpasswordValidationSchema,
		addSubscriberValidationSchema,
		addUserManualValidationSchema,
		addTechnicalManualValidationSchema,
		addTechnicalManualChildValidationSchema,
		addCompanyValidationSchema,
		changePasswordValidationSchema,
		changeProfileDetailsValidationSchema,
		userDetails,
		employeeDetails,
		companyOrTenantDetailsSchema,
		companyOrTenantDetailsPageSchema,
		authorizedPersonSchema,
		updateUserValidationSchema,
		contractorDetailsSchema,
		addSubscriberCompanyValidationSchema,
		addLocationSchema,
		createInvoiceSchema,
		changePasswordSubscriberValidationSchema,
		zoneManagementValidationSchema,
		updateDiversionAdminValidationSchema,
		createVolumeValidationSchema,
		createEquipmentValidationSchema,
		createMaterialValidationSchema,
		createFrequencyValidationSchema,
		diversionReportValidationSchema,
		diversionSettingsValidationSchema,
		createDiversionReportValidationSchema,
		createOrUpdateWeightsValidationSchema,
		weightsTableValidationschema,
		historydiversionReport,
		historyNewdiversionReport,
		createOrUpdateCourseCreator,
		createOrUpdateCourseAdmin,
		QuizValidationSchema,
		PDFTypeValidationSchema,
		TextBasedValidationSchema,
		YoutubeBasedValidationSchema,
		PublishCourseSchema
	};
};

export default useValidation;
