import React, {Suspense, useEffect, useState} from 'react';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {ProgressSpinner} from 'primereact/progressspinner';
import {SelectButton} from 'primereact/selectbutton';
import {useTranslation} from 'react-i18next';
import * as h from "./service/IndexHelper";
import logo from './logo.svg';
import './main.css';
import axios from "axios/index";
import i18n from "./translations/i18n";

function Page() {
	const {t, i18n} = useTranslation();
	const changeLanguage = lng => {
		i18n.changeLanguage(lng);
		localStorage.setItem('SelectedLanguage', lng);
	};

	const langSelectItems = [
		{label: 'English', value: 'en'},
		{label: 'Eesti', value: 'et'}
	];

	const urlSectors = 'http://localhost:8090/api/sectors'
	const urlVisitors = 'http://localhost:8090/api/visitors'

	useEffect(() => {
		const savedLanguage = localStorage.getItem('SelectedLanguage') || 'en';
		changeLanguage(savedLanguage);
		getSectors();
		getVisitors();
	}, []);

	let [isLoadingSectors, setIsLoadingSectors] = useState(true);
	let [isLoadingVisitors, setIsLoadingVisitors] = useState(true);
	let [sectors, setSectors] = useState([]);
	let [visitors, setVisitors] = useState([]);

	const getSectors = () => {
		axios.get(urlSectors)
				// .then(res => res.data[res.data.length - 1])
				.then(res => res.data)
				.then(data => {
							setIsLoadingSectors(false);
							setSectors(data);
							// console.log("Sectors data is: ", data);
						}
				)
				.catch((err) => {
					console.error("Could not fetch Sectors data ", err);
				}, [])
	};

	const getVisitors = () => {
		axios.get(urlVisitors)
				.then(res => res.data[res.data.length - 1])
				.then(data => {
							setIsLoadingVisitors(false);
							setVisitors(h.getVisitors(data));
							// console.log("Visitors data is: ", data);
						}
				)
				.catch((err) => {
					console.error("Could not fetch Visitors data", err);
				}, [])
	};

	const SectorsList = ({data}) => {
		return <select multiple size="30">>
			<React.Fragment>{createSectorsTable(data)}</React.Fragment>
		</select>
	}

	function createSectorsTable(items, currentlevel) {
		let level = 0;
		if (currentlevel !== undefined) {
			level = currentlevel;
		}
		return items.map(function (item, index) {
					let hasChildSectors = item.childSectors && item.childSectors.length > 0;
					let spacer = "\u00A0\u00A0\u00A0\u00A0".repeat(level);
					return <React.Fragment key={index}>
						<option key={item.id} value={item.id}>{spacer} {t(item.name)}</option>
						{hasChildSectors && createSectorsTable(item.childSectors, level + 1)}
					</React.Fragment>
				}
		);
	}

	return <div className="App">
		<SelectButton value={i18n.language} options={langSelectItems} onChange={(e) => changeLanguage(e.value)}
		              className='select-language-button'/>
		<div id="floating-box-main" className="floating-box">
			<div className={"title-and-main"}>
				<header>
					<div className="unselectable title-big">
						<span>{t('title.main')}</span>
					</div>
				</header>
				<div hidden={!isLoadingSectors}>
					<ProgressSpinner/>
				</div>
				<div hidden={isLoadingSectors} className="sectors-wrapper">
					<SectorsList data={sectors}/>
				</div>
			</div>
		</div>
	</div>
}

const Loader = () => (
		<div className="App">
			<img src={logo} className="App-logo" alt="logo"/>
			<div>loading...</div>
		</div>
);

export default function App() {
	return (
			<Suspense fallback={<Loader/>}>
				<Page/>
			</Suspense>
	);
}