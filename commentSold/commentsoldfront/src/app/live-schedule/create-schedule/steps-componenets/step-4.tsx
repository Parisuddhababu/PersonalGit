import FormValidationError from "@/components/FormValidationError/FormValidationError"
import { Message } from "@/constant/errorMessage"
import { EMAIL_REGEX} from "@/constant/regex"
import { GET_PRODUCTS } from "@/framework/graphql/queries/catalog"
import { GET_INFLUENCER } from "@/framework/graphql/queries/influencer"
import useValidation from "@/framework/hooks/validations"
import { setLoadingState } from "@/framework/redux/reducers/commonSlice"
import { CommonSliceTypes } from "@/framework/redux/redux"
import { GoLiveScheduleStep3, HostingType } from "@/types/components"
import { InfluencerData } from "@/types/graphql/pages"
import { GoLiveBrandScheduleStep3Form, GoLiveScheduleStep3Form, IGoLiveBrandScheduleStep3FormKeys, IInfluencers, IInputEvent, Product } from "@/types/pages"
import { useLazyQuery, useQuery } from "@apollo/client"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select';

const Step4 = ({ active, onPrev, onSubmitStep4, accordionHandle, selfEmail, onSubmitBrand }: GoLiveScheduleStep3) => {
    const { userDetails } = useSelector((state: CommonSliceTypes) => state.common)
    const [type, setType] = useState<HostingType>('single')
    const [influencerCount, setInfluencerCount] = useState({
        one: true,
        two: true,
        three: false,
        four: false
    })
    const [getInfluencers, {data, loading ,refetch}] = useLazyQuery(GET_INFLUENCER,{variables : {isAllInfluencers : true}})
    const { data: pData, loading: pLoading } = useQuery(GET_PRODUCTS,{variables : {isAllProducts: true}});
    const dispatch = useDispatch();
    const [influencerData,setInfluencerData] = useState<InfluencerData[]>([])
    const initialInfluencers = useMemo(()=>{
       return data?.fetchFrontInfluencers?.data?.influencerData?.filter(({status} : {status : string}) => status !== '0')
    },[data]);
    const path = usePathname()
    const {scheduleStep4Validations2} = useValidation()

    useEffect(()=>{
        getInfluencers()
        refetch()
    },[path])

    useEffect(()=>{
        setInfluencerData(data?.fetchFrontInfluencers?.data?.influencerData?.filter(({status} : {status : string}) => status !== '0'))
    },[data])

    useEffect(() => {
        dispatch(setLoadingState(loading || pLoading))
    }, [loading, pLoading])

    const {
        handleSubmit,
        formState: { errors },
        register,
        getValues : getValues1,
        setValue: setValue1
    } = useForm<GoLiveScheduleStep3Form>({
        defaultValues: {
            email1: selfEmail,
            email2: '',
            email3: '',
            email4: '',
        },
    });
    const Validations = {
        email2: {
            required: Message.EMAIL_REQUIRED,
            pattern: {
                value: EMAIL_REGEX,
                message: Message.EMAIL_PATTERN,
            },
            validate: (value :  string) => Object.values(getValues1()).filter((email) => email === value).length < 2 || Message.DUPLICATE_EMAIL_REQUIRED
        },
        email3: {
            pattern: {
                value: EMAIL_REGEX,
                message: Message.EMAIL_PATTERN,
            },
            validate: (value :  string) => {
               if(value === '') return Message.EMAIL_REQUIRED;
               return Object.values(getValues1()).filter((email) => email === value).length < 2 || Message.DUPLICATE_EMAIL_REQUIRED
            }
        },
        email4: {
            pattern: {
                value: EMAIL_REGEX,
                message: Message.EMAIL_PATTERN,
            },
            validate: (value :  string) => {
               if(value === '') return Message.EMAIL_REQUIRED;
               return Object.values(getValues1()).filter((email) => email === value).length < 2 || Message.DUPLICATE_EMAIL_REQUIRED
            }
        },
    };

    const _onSubmit = (values: GoLiveScheduleStep3Form) => {
        const lowerCaseEmails = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [key, value.toLowerCase()])
        );
        onSubmitStep4(lowerCaseEmails, type)
    }

    // brand multi influencers
    const {
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
        register: register2,
        setValue,
        getValues,
    } = useForm<GoLiveBrandScheduleStep3Form>({
        defaultValues: {
            user_uuid1: '',
            product_uuid1: '',
            user_uuid2: '',
            product_uuid2: '',
            user_uuid3: '',
            product_uuid3: '',
            user_uuid4: '',
            product_uuid4: ''
        },
    });

    const _onSubmit2 = (values: GoLiveBrandScheduleStep3Form) => {
        const influencers : IInfluencers[] = []

        for (let i = 1; i <= 4; i++) {
            const productKey = `product_uuid${i}` as keyof GoLiveBrandScheduleStep3Form;
            const userKey = `user_uuid${i}` as keyof GoLiveBrandScheduleStep3Form;
            
            if (values?.[productKey] && values?.[userKey]) {
                influencers.push({
                    product_uuid: values[productKey] as string,
                    user_uuid: values[userKey] as string,
                });
            }
        }
        onSubmitBrand(influencers)
    }

    const onAddInfluencerCount = () => {
        if (!influencerCount.three) {
            setInfluencerCount({ ...influencerCount, three: true })
            return
        }
        if (!influencerCount.four) {
            setInfluencerCount({ ...influencerCount, four: true })
            return
        }
    }

    const onChange = (selectedOption: IInputEvent, key: IGoLiveBrandScheduleStep3FormKeys) => {
        setValue(key, selectedOption?.value!);
        handleRemainingInfluencerData()
    }

    const handleRemainingInfluencerData = () => {
        const selectedInfluencer = Object.entries(getValues()).map((array : string[]) => array[0].includes('user_uuid') ? array[1] : '').filter(Boolean)
        setInfluencerData(initialInfluencers.filter(({uuid} : {uuid : string}) => !selectedInfluencer.includes(uuid)))
    }

    return (
        <li className={`golive-list-item ${active ? 'active completed' : ''}`}>
            <div className="golive-item-header">
                <span className="golive-item-number h3">2</span>
                <div className="golive-item-title-wrap">
                    <h2 className="h3">Set up your Stream Sources</h2>
                    <p>Manually add products into your catalog to complete</p>
                </div>
                <span className="golive-item-icon" onClick={() => accordionHandle('step2')}></span>
            </div>
            <div className="golive-item-content">
                {
                    userDetails?.user_type === '3' &&
                    <form onSubmit={handleSubmit2(_onSubmit2)}>
                        <div className="influencer-product-row">
                            <div className="influencer-product-col">
                                <div className="form-group spacing-40">
                                    <label htmlFor="user_uuid1">Select Influencer*</label>
                                    <div className="react-select-design with-icon">
                                        <Select
                                            {...register2('user_uuid1', scheduleStep4Validations2.user_uuid1)}
                                            placeholder="Select Influencer"
                                            id="user_uuid1"
                                            name="user_uuid1"
                                            onChange={(v) => onChange(v as IInputEvent, 'user_uuid1')}
                                            options={influencerData?.map((data: InfluencerData) => (
                                                {
                                                    value: data?.uuid,
                                                    label: `${data?.first_name} ${data?.last_name}`
                                                }
                                            ))}

                                        />
                                        <span className="icon icon-flag"></span>
                                    </div>
                                    <FormValidationError errors={errors2} name="user_uuid1" />
                                </div>
                            </div>
                            <div className="influencer-product-col">
                                <div className="form-group spacing-40">
                                    <label htmlFor="product_uuid1">Select Product*</label>
                                    <div className="react-select-design with-icon">
                                        <Select
                                            {...register2('product_uuid1', scheduleStep4Validations2.product_uuid1)}
                                            placeholder="Select Product"
                                            id="product_uuid1"
                                            name="product_uuid1"
                                            onChange={(v) => onChange(v as IInputEvent, 'product_uuid1')}
                                            options={pData?.fetchProducts?.data?.productData?.map((item: Product) => (
                                                {
                                                    value: item?.uuid,
                                                    label: item?.name
                                                }
                                            ))}
                                        />
                                        <span className="icon icon-flag"></span>
                                    </div>
                                    <FormValidationError errors={errors2} name="product_uuid1" />
                                </div>
                            </div>
                        </div>
                        <div className="influencer-product-row">
                            <div className="influencer-product-col">
                                <div className="form-group spacing-40">
                                    <label htmlFor="user_uuid2">Select Influencer*</label>
                                    <div className="react-select-design with-icon">
                                        <Select
                                            {...register2('user_uuid2', scheduleStep4Validations2.user_uuid2)}
                                            placeholder="Select Influencer"
                                            id="user_uuid2"
                                            name="user_uuid2"
                                            onChange={(v) => onChange(v as IInputEvent, 'user_uuid2')}
                                            options={influencerData?.map((data: InfluencerData) => (
                                                {
                                                    value: data?.uuid,
                                                    label: `${data?.first_name} ${data?.last_name}`
                                                }
                                            ))}

                                        />
                                        <span className="icon icon-flag"></span>
                                    </div>
                                    <FormValidationError errors={errors2} name="user_uuid2" />
                                </div>
                            </div>
                            <div className="influencer-product-col">
                                <div className="form-group spacing-40">
                                    <label htmlFor="product_uuid2">Select Product*</label>
                                    <div className="react-select-design with-icon">
                                        <Select
                                            {...register2('product_uuid2', scheduleStep4Validations2.product_uuid2)}
                                            placeholder="Select Product"
                                            id="product_uuid2"
                                            name="product_uuid2"
                                            onChange={(v) => onChange(v as IInputEvent, 'product_uuid2')}
                                            options={pData?.fetchProducts?.data?.productData?.map((item: Product) => (
                                                {
                                                    value: item?.uuid,
                                                    label: item?.name
                                                }
                                            ))}
                                        />
                                        <span className="icon icon-flag"></span>
                                    </div>
                                    <FormValidationError errors={errors2} name="product_uuid2" />
                                </div>
                            </div>
                        </div>
                        {
                            influencerCount.three &&
                            <div className="influencer-product-row">

                                <div className="influencer-product-col">
                                    <div className="form-group spacing-40">
                                        <label htmlFor="user_uuid3">Select Influencer{getValues('product_uuid3') && "*"}</label>
                                        <div className="react-select-design with-icon">
                                            <Select
                                                {...register2('user_uuid3',getValues('product_uuid3') ? scheduleStep4Validations2.user_uuid3 : {})}
                                                placeholder="Select Influencer"
                                                id="user_uuid3"
                                                name="user_uuid3"
                                                onChange={(v) => onChange(v as IInputEvent, 'user_uuid3')}
                                                options={influencerData?.map((data: InfluencerData) => (
                                                    {
                                                        value: data?.uuid,
                                                        label: `${data?.first_name} ${data?.last_name}`
                                                    }
                                                ))}

                                            />
                                            <span className="icon icon-flag"></span>
                                        </div>
                                        <FormValidationError errors={errors2} name="user_uuid3" />
                                    </div>
                                </div>
                                <div className="influencer-product-col">
                                    <div className="form-group spacing-40">
                                        <label htmlFor="product_uuid3">Select Product{getValues('user_uuid3') && "*"}</label>
                                        <div className="react-select-design with-icon">
                                            <Select
                                                {...register2('product_uuid3',getValues('user_uuid3') ? scheduleStep4Validations2.product_uuid3 : {})}
                                                placeholder="Select Product"
                                                id="product_uuid3"
                                                name="product_uuid3"
                                                onChange={(v) => onChange(v as IInputEvent, 'product_uuid3')}
                                                options={pData?.fetchProducts?.data?.productData?.map((item: Product) => (
                                                    {
                                                        value: item?.uuid,
                                                        label: item?.name
                                                    }
                                                ))}

                                            />
                                            <span className="icon icon-flag"></span>
                                        </div>
                                        <FormValidationError errors={errors2} name="product_uuid3" />
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            influencerCount.four &&
                            <div className="influencer-product-row">
                                <div className="influencer-product-col">
                                    <div className="form-group spacing-40">
                                        <label htmlFor="user_uuid4">Select Influencer{getValues('product_uuid4') && "*"}</label>
                                        <div className="react-select-design with-icon">
                                            <Select
                                                {...register2('user_uuid4',getValues('product_uuid4') ? scheduleStep4Validations2.user_uuid4 : {})}
                                                placeholder="Select Influencer"
                                                id="user_uuid4"
                                                name="user_uuid4"
                                                onChange={(v) => onChange(v as IInputEvent, 'user_uuid4')}
                                                options={influencerData?.map((data: InfluencerData) => (
                                                    {
                                                        value: data?.uuid,
                                                        label: `${data?.first_name} ${data?.last_name}`
                                                    }
                                                ))}

                                            />
                                            <span className="icon icon-flag"></span>
                                        </div>
                                        <FormValidationError errors={errors2} name="user_uuid4" />
                                    </div>
                                </div>
                                <div className="influencer-product-col">
                                    <div className="form-group spacing-40">
                                        <label htmlFor="product_uuid4">Select Product{getValues('user_uuid4') && "*"} </label>
                                        <div className="react-select-design with-icon">
                                            <Select
                                                {...register2('product_uuid4',getValues('user_uuid4') ? scheduleStep4Validations2.product_uuid4 : {})}
                                                placeholder="Select Product"
                                                id="product_uuid4"
                                                name="product_uuid4"
                                                onChange={(v) => onChange(v as IInputEvent, 'product_uuid4')}
                                                options={pData?.fetchProducts?.data?.productData?.map((item: Product) => (
                                                    {
                                                        value: item?.uuid,
                                                        label: item?.name
                                                    }
                                                ))}
                                            />
                                            <span className="icon icon-flag"></span>
                                        </div>
                                        <FormValidationError errors={errors2} name="product_uuid4" />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="add-influencer-btn-group">
                            <button
                                type="button"
                                className={`btn btn-${!influencerCount.four ? 'primary' : 'secondary'}-outline`}
                                disabled={influencerCount.four}
                                onClick={onAddInfluencerCount}
                            >+ Add Influencer</button>
                            <button type="submit" className="btn btn-primary btn-next btn-icon">Send Invitation <span className="icon-right-long icon"></span></button>
                        </div>
                    </form>
                }
                {
                    userDetails?.user_type === '2' &&
                    <div className="single-hosting-card">
                        <div className="nav scrollbar-sm">
                            <ul className="list-unstyled">
                                <li className={`${type === 'single' ? 'acitve' : ''}`} onClick={() => { setType('single') }}>Single Hosting</li>
                                <li className={`${type === 'multi' ? 'acitve' : ''}`} onClick={() => { setType('multi') }}>Multiple Hosting</li>
                            </ul>
                        </div>
                        <div className={`nav-tab ${type === 'single' ? 'active' : ''}`}>
                            <div className="want-to-go-live">
                                <div className="want-to-go-live-left">
                                    <p className="h3 spacing-10">Schedule your Single Go Live</p>
                                    <p className="spacing-0 font-300">Check the session details and then go ahead by clicking on Schedule Button</p>
                                </div>
                                <div className="want-to-go-live-right">
                                    <button className="btn btn-primary" onClick={() => onSubmitStep4(undefined, type)}>Schedule</button>
                                </div>
                            </div>
                        </div>
                        <div className={`nav-tab ${type === 'multi' ? 'active' : ''}`}>
                            <form onSubmit={handleSubmit(_onSubmit)}>
                                <div className="want-to-go-live">
                                    <div className="want-to-go-live-left">
                                        <p className="h3 spacing-10">Want to add more Influencers?</p>
                                        <p className="spacing-0 font-300">Check the connection at higher definition to ensure best experience for customers.</p>
                                    </div>
                                    <div className="want-to-go-live-right spacing-30">
                                        <button className="btn btn-primary" type="submit">Schedule</button>
                                    </div>
                                    <div className="guest-to-live">
                                        <p className="h3 spacing-10">Invite Guest to Live</p>
                                        <p className="font-300 spacing-10">Increase engagement by adding special guest to help host your live.</p>
                                        <ul className="guest-to-live-list list-unstyled invite-guest-ul-lists">
                                            <li>
                                                <div className="guest-to-live-list-control">
                                                    <input
                                                        {...register('email1')}
                                                        type="email1"
                                                        className="form-control"
                                                        placeholder="Enter Email 1"
                                                        name="email1" id="email1"
                                                        disabled
                                                        aria-label="guest Email 1"
                                                    />
                                                </div>
                                            </li>
                                            <li>
                                                <div className="guest-to-live-list-control">
                                                    <input
                                                        {...register("email2", Validations.email2)}
                                                        type="email2"
                                                        className="form-control"
                                                        placeholder="Enter Email 2"
                                                        name="email2" id="email2" aria-label="guest Email 2"/>
                                                    <FormValidationError errors={errors} name="email2" />
                                                </div>
                                            </li>
                                            {influencerCount.three && <li>
                                                <div className="guest-to-live-list-control">
                                                    <input
                                                        {...register("email3", Validations.email3)}
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Enter Email 3"
                                                        name="email3"
                                                        id="email3" aria-label="guest Email 3"/>
                                                    <FormValidationError errors={errors} name="email3" />
                                                </div>
                                                <button className="btn btn-secondary" onClick={() => {
                                                    setInfluencerCount({ ...influencerCount, three: false })
                                                    setValue1('email3',"")
                                                }}><span className="icon-trash"></span></button>
                                            </li>}
                                            {influencerCount.four && <li>
                                                <div className="guest-to-live-list-control">
                                                    <input
                                                        {...register("email4", Validations.email4)}
                                                        type="email"
                                                        className="form-control"
                                                        placeholder={`Enter Email ${influencerCount.three ? '4' : '3'}`}
                                                        name="email4"
                                                        id="email4" aria-label="guest Email 4"/>
                                                    <FormValidationError errors={errors} name="email4" />
                                                </div>
                                                <button className="btn btn-secondary" onClick={() => {
                                                    setInfluencerCount({ ...influencerCount, four: false })
                                                    setValue1('email4',"")
                                                }}><span className="icon-trash"></span></button>
                                            </li>}
                                        </ul>
                                    </div>
                                    <div className="add-influencer-btn-group">
                                        <button
                                            type="button"
                                            className={`btn btn-${!influencerCount.four ? 'primary' : 'secondary'}-outline`}
                                            disabled={!Object.values(influencerCount).includes(false)}
                                            onClick={onAddInfluencerCount}
                                        >+ Add Guest</button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                }

                <br />
                <div className="step-btn-group">
                    <button type="button" className="btn btn-secondary btn-prev btn-icon" onClick={onPrev}><span className="icon-left-long icon"></span> Previous</button>
                </div>
            </div>
        </li>
    )
}

export default Step4