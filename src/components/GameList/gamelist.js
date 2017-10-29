import React,{Component} from 'react';
import axios from 'axios';
import YoutubeSearch from 'youtube-api-search';
const YOUAPI_KEY='';

class GameList extends Component{

    constructor(props){
        super(props);

        this.state={
            gamesArray:[],
            currentPage:1,
            itemsPerPage:10,
            searchArray:[],
            sort:0,
            platform:[],
            term:'latest game trailer',
            videoId:'K-5EdHZ0hBs'
        };

        axios.get('http://starlord.hackerearth.com/gamesarena')
            .then((val)=>{
                this.setState({gamesArray:val.data.slice(1)});
                this.setState({searchArray:this.state.gamesArray});
            }).catch((err)=>{
                console.log(err);
            });      
        
        

        this.onPageChange=this.onPageChange.bind(this);
        
    }    

    onPageChange(event){
        console.log(event.target.id);
        this.setState({
            currentPage:Number(event.target.id)
        });
    }

    getScoreLabel(score){
        let val=parseFloat(score);
        if(val>=7){
            return <a href="#" className="badge badge-success">{`score: ${val}`}</a>
        }
        else if(val>5&&val<7){
            return <a href="#" className="badge badge-info">{`score: ${val}`}</a>
        }
        else{
            return <a href="#" className="badge badge-danger">{`score: ${val}`}</a>
        }
    }

    getEditorsChoice(choice){
        if(choice==='Y'){
            return <span className="badge badge-warning">Editor's Choice</span>
        }
    }

    //On title Search
    onSearch(event){
        this.setState({gamesArray:this.state.searchArray});
        let inputValue = event.target.value.toLowerCase();
        let inputLength = inputValue.length;
        let nArr=[];

        if(inputLength===0){
            nArr=this.state.searchArray;
        }
        else{
            nArr=this.state.searchArray.filter(game => game.title.toLowerCase().slice(0, inputLength) === inputValue);
        }
        this.setState({gamesArray:nArr});  
    }

    //Youtube Video Interface
    getVideo(title){
        YoutubeSearch({key:YOUAPI_KEY,term:title+' trailer'},(res)=>{
            let val=res[0].id.videoId;
            this.setState({videoId:val});
        });
    }
    

    //Render Games List
    getGameslist(){
        if(this.state.gamesArray===[]){
            return <div>Loading</div>
        }
        let games=this.state.gamesArray;
        const indexofLast=this.state.currentPage*this.state.itemsPerPage;
        const indexofFirst=indexofLast-this.state.itemsPerPage;
        const activeGameArray=games.slice(indexofFirst,indexofLast);

        return activeGameArray.map((val)=>{            
            return(
                <div className="card text-white bg-dark mb-3" onClick={(event)=>{this.getVideo(val.title)}}>
                    <div className="card-body">
                        <h4 className="card-title">{val.title}</h4>
                        <p className="card-subtitle mb-2 text-muted">{val.platform}</p>
                        <div className="row">
                        &emsp;
                            <div>
                                {this.getScoreLabel(val.score)}
                            </div>
                            &emsp;
                            <div>
                                <a href="#" className="badge badge-light">{val.genre}</a>
                            </div>
                            &emsp;
                            <div>
                                {this.getEditorsChoice(val.editors_choice)}
                            </div>
                        </div>    
                                            
                    </div>
                </div>    
            )         
        });
    }

    //Function to filter by score
    sortbyScore(event){
        let nArr=this.state.gamesArray;        
        nArr.sort((a,b)=>{
            if(this.state.sort===0){
                this.setState({sort:1});
                return parseFloat(b.score)-parseFloat(a.score);
            }
            else{
                this.setState({sort:0});
                return parseFloat(a.score)-parseFloat(b.score);
            }            
        });
        this.setState({gamesArray:nArr});
    }

    //Function to set pages numbers
    renderPageNumbers(){
        const pageArray=[];
        for(let i=1;i<=Math.ceil(this.state.gamesArray.length/this.state.itemsPerPage);i++){
            pageArray.push(i);
        }

        return pageArray.map((number)=>{
            if(this.state.currentPage===number){
                return <li className="page-item active"><a className="page-link" id={number} onClick={(event)=>{this.onPageChange(event)}}>{number}</a></li>
            }
            return <li className="page-item"><a className="page-link" id={number} onClick={(event)=>{this.onPageChange(event)}}>{number}</a></li>
        })
    }


    //Function to filter Games based on platform
    getPlatform(event){
        this.setState({gamesArray:this.state.searchArray});
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let nArr=this.state.platform;
        
        if(value===true){
            nArr.push(name);
        }
        else{
            nArr.pop(name);
        }

        this.setState({platform:nArr});

        if(this.state.platform.length===0){
            this.setState({gamesArray:this.state.searchArray});
        }
        else{
            let cArr=[];            
                this.state.searchArray.map((val)=>{
                    this.state.platform.map((res)=>{
                        if(val.platform===res){
                            cArr.push(val);
                        }
                    });
                });
                this.setState({gamesArray:cArr});
                console.log(cArr);
            }  
    }   

    render(){
        return(
            <div className="container">
                <div className="row">
                    <nav className="col-sm-4" aria-label="Page navigation">
                        <ul className="pagination">
                            {this.renderPageNumbers()}                    
                        </ul>
                    </nav>
                    <div className="col-sm-6">
                        <input className="form-control" type="text" placeholder="Search" onChange={(event)=>{this.onSearch(event)}}/>
                    </div>                    
                    <div className="col-sm-2">
                    <button type="button" className="btn btn-primary" onClick={(event)=>{this.sortbyScore(event)}}>Sort by score</button>
                    </div>
                                  
                </div>
              
                <table className="table">
                    <tbody>                        
                        <tr className="row">
                            <td className="col-md-5">
                                {this.getGameslist()}
                            </td>
                            <td className="col-md-7" >
                                <table className="table">
                                    <tbody>                        
                                        <tr className="row">
                                            <td className="col-md-12">
                                                <div className="embed-responsive embed-responsive-16by9">
                                                    <iframe className="embed-responsive-item" src={`https://www.youtube.com/embed/${this.state.videoId}?rel=0`} allowFullScreen></iframe>
                                                </div>  
                                            </td>
                                            <td className="col-md-12">
                                                <ul className="list-group">
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="Nintendo DS" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>Nintendo DS
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="iPhone" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>iPhone
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="iPad" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>iPad
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="PC" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>PC
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="PlayStation 3" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>PlayStation 3
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="Xbox 360" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>Xbox 360
                                                        </label>
                                                    </li>
                                                    <li className="list-group-item">
                                                        <label className="form-check-label">
                                                            <input className="form-check-input" name="PlayStation Vita" type="checkbox" id="inlineCheckbox1" value="option1" onChange={(event)=>{this.getPlatform(event)}}/>PlayStation Vita
                                                        </label>
                                                    </li>
                                                </ul>
                                            </td>                            
                                        </tr>
                                    </tbody>
                                </table>
                            </td>                            
                        </tr>
                    </tbody>    
                </table>
            
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.renderPageNumbers()}                    
                    </ul>
                 </nav>
            </div>         

            
        );
    }
}

export default GameList;