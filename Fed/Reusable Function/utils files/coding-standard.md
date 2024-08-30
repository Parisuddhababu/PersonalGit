# Coding Standard for Next Js Base Structure

## Remove Commented Code

  - Example
    ```
      <!-- const getMoreData = () => {

      } -->
    ```
    - if above given code is found then we need to remove it

## Remove un-used import statements
  - Example
    ```
      import IListingData from "@templates/Listing/index"
    ```
    - If current component not required the IListingData then we need to remove it.


##  Need to define types where we are used a useState
  - Example
    ```
    export interface ICatalogListData {
      _id: string;
      name: string;
      image: string;
      is_active: boolean;
    }

    const [catalogList, setCatalogList] = useState<ICatalogListData[]>(props.list);
    ```
    - If we used useState hook of react then we also need to define it's type for which type of data this state is used.

## Need to used Import statement Like belows
  - Example
    ```
      ## Wrong way to used import statement 
      import { IListingData } from '../../templates/IListingData/index';

      ## Correct way to used import
      import { IListingData } from '@templates/IListingData/index'
    ```
    - We need to follow correct way to used import statement

##  Used Clink or OptionalClink insted of anchor tag
  - Example
    ```
      ## Wrong way to used 
      <a href="https://github.com/" target="_blank">github</a>

      ## Correct way to used
      <Clink link="https://github.com/" target="_blank">github</Clink>

      ### If link is Optional then we need to use OptionalClink
      <OptionalClink link="https://github.com/" target="_blank">github</OptionalClink>
    ```

## Removed un wanted define variables
  - Example
    ```
      const data = "dummy";
      const title = "Hello world!";

      <div>{ title }</div>
    ```
    - In above example data variable we don't used anywhere so we need to remove that variable.

## Need to add comment before any function
  - Example
    ```
      /**
        * Check Current Name is Active or Not
        * @param IData - this is object of data
        * @return boolean - true, false
      */
      const isActiveCurrentName = (data: { is_active: boolean, id: string,  name: string }) => {
        const index = data.findIndex((ele) => ele.is_active === true);
        if (index !== -1) {
          return true;
        }
        return false;
      }
    ```
    - Aboove given example show how to write a comment on any function and it is used to understand for logic and function requirements 
    - Above comments help us any other developer to what function exactly do. for understanding of logic and return and parameters.

## Make a component re-usable if possible
  - If you already know the this things are used in other place also then you can make component in that way that we can re-used 
  - For Example if we have form and also having a validation and we need to display error messages then we can create one common error handling component for display error messages

## Don't used dangerouslySetInnerHTML
  - Example
    ```
     ## Wrong way to use
     <span dangerouslySetInnerHTML={{ __html: htmlData) }} />

     ## Correct way to use
     import SafeHtml from "@lib/SafeHTML";
     <SafeHtml html={footerAboutUsData?.description} />
    ```

## Before every loop execution to bind data in html we need to add wrapper component
  - Example
    ```
    <Wrapper andRequired={[Array.isArray(props.list), props.list?.length]}>
      {props?.list?.map((mainMenu) => (
        <div className="footer-sec my-account-links" key={uuid()}>
          <p className="footer-links-title">{mainMenu?.menu_header_title}</p>
        </div>
      ))}
    </Wrapper>
    ```

## After Every loop execution in html code we need to add a unique key props
  - Example
    ```
    <Wrapper andRequired={[Array.isArray(props.list), props.list?.length]}>
      {props?.list?.map((mainMenu) => (
        <div className="footer-sec my-account-links" key={"ADD_UNIQUE_KEY"}>
          <p className="footer-links-title">{mainMenu?.menu_header_title}</p>
        </div>
      ))}
    </Wrapper>
    ```
    - `ADD_UNIQUE_KEY` we need to add dynamic uniquer key in place of this text

## Define Every constant in one single file
  - Example
    ```
      export const AppConfig = {
        AppName: "my-app",
        AppDescription: "My application is ...", 
      }
    ```
    - Above const AppConfig we can used in every component where ever we required


## Define static Image path in one constant file
  - Example
    ```
      export const IMAGE_PATH = {
        bannerImagePath: "/assets/banner_image.png",
        userProfile: "/assets/user_profile.png"
      }
    ```
    - IMAGE_PATH const we can used in every component where ever we required

## Try Keep your function, interface, class and method name uniquer and understandable easily
  - Example
    ```
      const LoadMoreData = () => {
        // here your load more data logic
      }
    ```
    - As above function name is clearly understand it's functionality is to load more data.

## Define Variable name in camel Case all orver the project or any other type
  - Example
    ```
      const loadData = "Load Data";
      const nextData = "Next Data";
    ```
    - For whole application we need to follow one pattern of naming standard

## Use shorthand for boolean props
  - Example
    ```
      ### Don't use like this given below
      <RegistrationForm hasPadding={true} withError={true} />

      ### Use like this given below
      <RegistrationForm hasPadding withError />
    ```
## Avoid curly braces for string props
  - Example
    ```
     ### Don't used like this given below
     <Paragraph variant={"h5"} heading={"A new book"} />

     ### Use like this given below
     <Paragraph variant="h5" heading="A new book" />
    ```

## Write a fragment when a div is not needed (extra div or other tags not add) insted of used Fragment like given below
  - Example
    ```
      const InfoText = () => {
	
        return (
          <>
            <h1>Welcome!</h1>
            <p>This our new page, we're glad you're are here!</p>
          </>
        )
      }
    ```

## Use JSX sortHand
  - Example
    ```
      ### Don't use like this
      <NavBar></NavBar>

      ### use like this
      <NavBar />
    ```

## Use Ternary Operators insted of if else
  - Example
    ```
      ### Don't use like this
      const { role } = user;

      if(role === ADMIN) {
        return <AdminUser />
      }else{
        return <NormalUser />
      } 

      ### Use like this
      const { role } = user;
      return role === ADMIN ? <AdminUser /> : <NormalUser />
    ```

## Don't Define a Function Inside Render
  - Example
    ```
      ### Don't use like this
      return (
          <button onClick={() => dispatch(ACTION_TO_SEND_DATA)}>    // NOTICE HERE
            This is a bad example 
          </button>  
      )

      ### use like this
      const submitData = () => dispatch(ACTION_TO_SEND_DATA)

      return (
        <button onClick={submitData}>  
          This is a good example 
        </button>  
      )
    ```

## Large function then devide into sub smaller function
  - Example
    ```
      ### Don't use like this
      const onSubmit = (e) => {
        e.preventDefault()
            let resObj = {
                footer_back_color: masterForm.background_color,
                footer_copyright_text: masterForm.copyright_text,
                footer_text_color: masterForm.text_color,
                is_active: 1,
                website_id: masterForm.website,
            }

            let footer_menus = []
            let menu_links_1 = []
            masterForm?.menu1Obj?.map((data, i) => {
                menu_links_1.push({title : data.title, link : data.url})
            })
            masterForm.menu1Title &&  footer_menus.push({menu_header_title:masterForm.menu1Title,menu_links: menu_links_1  })

            let menu_links_2 = []
            masterForm?.menu2Obj?.map((data, i) => {
                menu_links_2.push({title : data.title, link : data.url})
            })
            masterForm.menu2Title &&  footer_menus.push({menu_header_title:masterForm.menu2Title,menu_links: menu_links_2  })

            let menu_links_3 = []
            masterForm?.menu3Obj?.map((data, i) => {
                menu_links_3.push({title : data.title, link : data.url})
            })
            masterForm.menu3Title &&  footer_menus.push({menu_header_title:masterForm.menu3Title,menu_links: menu_links_3  })

            let menu_links_4 = []
            masterForm?.menu4Obj?.map((data, i) => {
                menu_links_4.push({title : data.title, link : data.url})
            })
            masterForm.menu4Title && footer_menus.push({menu_header_title:masterForm.menu4Title,menu_links: menu_links_4  })

            resObj['footer_menus'] = footer_menus
            setIsLoading(true)
            if (masterForm.website) {
                API.UpdateMasterData(addEditMasterRes, resObj, true, masterForm.website, Constant.MICROSITE_FOOTER_UPDATE)
            } 
      }
      -----------------------------------------
      ### Use Like this function
      const onSubmit = () => {
        e.preventDefault();
        let resObj = {
            footer_back_color: masterForm.background_color,
            footer_copyright_text: masterForm.copyright_text,
            footer_text_color: masterForm.text_color,
            is_active: 1,
            website_id: masterForm.website,
        }

        formDataCreate(resObj);
      }

      const formDataCreate = (resObj) => {
        let menu_links_1 = []
        masterForm?.menu1Obj?.map((data, i) => {
            menu_links_1.push({title : data.title, link : data.url})
        })
        masterForm.menu1Title &&  footer_menus.push({menu_header_title:masterForm.menu1Title,menu_links: menu_links_1  })

        let menu_links_2 = []
        masterForm?.menu2Obj?.map((data, i) => {
            menu_links_2.push({title : data.title, link : data.url})
        })
        masterForm.menu2Title &&  footer_menus.push({menu_header_title:masterForm.menu2Title,menu_links: menu_links_2  })

        let menu_links_3 = []
        masterForm?.menu3Obj?.map((data, i) => {
            menu_links_3.push({title : data.title, link : data.url})
        })
        masterForm.menu3Title &&  footer_menus.push({menu_header_title:masterForm.menu3Title,menu_links: menu_links_3  })

        let menu_links_4 = []
        masterForm?.menu4Obj?.map((data, i) => {
            menu_links_4.push({title : data.title, link : data.url})
        })
        masterForm.menu4Title && footer_menus.push({menu_header_title:masterForm.menu4Title,menu_links: menu_links_4  })

        resObj['footer_menus'] = footer_menus
        setIsLoading(true)
        ApiCalling(resObj)
      }

      const apiCalling = (resObj) => {
        if (masterForm.website) {
            API.UpdateMasterData(addEditMasterRes, resObj, true, masterForm.website, Constant.MICROSITE_FOOTER_UPDATE)
        } 
      }
    ```

## Don't use `var` insted of it used a `let` or `const`
  - Examples
    ```
      ### Don't use
      var data = 'First Name Data'

      ### Use like this
      let data = 'First Name Data'
              OR
      const data = 'First Name Data'
    ```
## Avoid Inline CSS
  - Example
    ```
      ### Don't use
      <div style="{{ backgroundColor: #153d32}}">Brainvire</div>

      ### Use like this
      .background {
        background-color: #153d32;
      }
      <div className="background">Brainvire</div>
    ```  
    - In above given example we need to create seperate file for css and inside that file need to write down the css and import in required component and used that css selectior 
    
