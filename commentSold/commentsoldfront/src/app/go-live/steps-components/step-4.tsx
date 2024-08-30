import { GoLiveStep4 } from "@/types/components"

const Step4 = ({ active, onPrev, onSubmitStep4}: GoLiveStep4) => {

    return (
        <li className={`golive-list-item ${active ? 'active completed' : ''}`}>
            <div className="golive-item-header">
            <span className="icon-check"></span>
                <span className="golive-item-number h3">4</span>
                <div className="golive-item-title-wrap">
                    <h2 className="h3">Set up your Stream Sources</h2>
                    <p>Manually add products into your catalog to complete</p>
                </div>
                <span className="golive-item-icon" ></span>
            </div>
            <div className="golive-item-content">
                <div className="want-to-go-live">
                    <div className="want-to-go-live-left">
                        <h2 className="h3 spacing-10">Want to Go Live Now?</h2>
                        <p className="spacing-0 font-300">Check the session details and then go ahead by clicking on Go Live Button</p>
                    </div>
                    <div className="want-to-go-live-right">
                        <button className="btn btn-primary" onClick={onSubmitStep4}>Go Live</button>
                    </div>
                </div>
                <br />
                <div className="step-btn-group">
                    <button className="btn btn-secondary btn-prev btn-icon" onClick={onPrev}><span className="icon-left-long icon"></span> Previous</button>
                </div>
            </div>
        </li>
    )
}

export default Step4