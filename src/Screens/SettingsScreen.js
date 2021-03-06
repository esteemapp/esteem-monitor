import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeMarketDataUrl, changeServerUrl, toggleParticipation, changeTheme} from '../store/action/changeServer';
import {View, Text, Switch, AsyncStorage, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import {Header, Title, Right, Left, Body} from 'native-base';
import {updateParticipation, getParticipation} from "../components/ConnectionToServer/serverConfig";
import Icon from 'react-native-vector-icons/Foundation';
import globalStyles from '../GlobalStyles/styles';
import EStyleSheet from 'react-native-extended-stylesheet';

let fcmtoken = null;

class SettingsScreen extends Component {
    state = {
        value: false,
        editable1: false,
        editable2: false,
        textinput1: '',
        textinput2: '',
        themeSwitch: (this.props.mode === 'day')
    };
    handleOnToggle = async (value) => {
        this.props.onToggleParticipation(value);
        if (fcmtoken) {
            await updateParticipation(fcmtoken, value);
        }
    };

    async componentWillMount() {
        await this.getToken();
    }

    getToken = async () => {
        try {
            fcmtoken = await AsyncStorage.getItem('fcmToken');

            if (fcmtoken) {
                getParticipation(fcmtoken);
            }
        } catch (e) {
            alert(e)
        }
    };
    handleServerUrlChanged = (url) => {
        this.setState({
            editable1: false
        });
        if (url !== "") {
            this.props.onChangeServerUrl(url);
            ToastAndroid.showWithGravityAndOffset(
                "You changed server Url. It will automatically reload the app.Please wait",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                20,
                80,
            );
        }

    };
    handleMarketDataUrlChanged = (url) => {
        this.setState({
            editable2: false
        });
        if (url !== "") {
            this.props.onChangeMarketDataUrl(url);
            ToastAndroid.showWithGravityAndOffset(
                "You changed server Url. It will automatically reload the app.Please wait",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                20,
                80,
            );
        }


    };
    onServerUrlChanger = () => {
        this.setState({
            editable1: true
        })
    };
    onMarketDataUrlChanger = () => {
        this.setState({
            editable2: true
        })
    };
    changeServerView = () => {
        if (this.state.editable1) {
            return (
                <TouchableOpacity onPress={() => this.handleServerUrlChanged(this.state.textinput1)}>
                    <Text style={{color: styles.$defaultText}}>OK</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    onPress={() => this.onServerUrlChanger()}
                >
                    <Icon
                        name="pencil"
                        size={20}
                        color={styles.$defaultText}
                    />
                </TouchableOpacity>
            );
        }
    };
    changeMarketDataView = () => {
        if (this.state.editable2) {
            return (
                <TouchableOpacity onPress={() => this.handleMarketDataUrlChanged(this.state.textinput2)}>
                    <Text style={{color: styles.$defaultText}}>OK</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    onPress={() => this.onMarketDataUrlChanger()}
                >
                    <Icon
                        name="pencil"
                        size={20}
                        color={styles.$defaultText}
                    />
                </TouchableOpacity>
            );
        }
    };
    handleTheme = (value) => {
        this.props.onChangeTheme(value);
        this.setState({
            themeSwitch: !this.state.themeSwitch
        });
    };
    renderThemeSwitch = () => {
        if (this.state.themeSwitch) {
            return (
                <View style={{flexDirection: 'row', width: '100%',paddingTop:20}}>
                    <View style={{width: '25%', alignItems: 'center'}}>
                        <Text style={{color: styles.$defaultText}}>Day Mode</Text>
                    </View>
                    <View style={{width: '75%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Switch
                            onTintColor={styles.$circleWitness}
                            tintColor={styles.$defaultText}
                            thumbTintColor={styles.$witnessListSecondaryText}
                            onValueChange={(value) => this.handleTheme(value)}
                            value={this.state.themeSwitch}
                        />
                    </View>
                </View>
            );

        } else {
            return (
                <View style={{flexDirection: 'row', width: '100%',paddingTop:20}}>
                    <View style={{width: '25%', alignItems: 'center'}}>
                        <Text style={{color: styles.$defaultText}}>Night Mode</Text>
                    </View>
                    <View style={{width: '75%', justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Switch
                            onTintColor={styles.$circleWitness}
                            tintColor={styles.$defaultText}
                            thumbTintColor={styles.$witnessListSecondaryText}
                            onValueChange={(value) => this.handleTheme(value)}
                            value={this.state.themeSwitch}
                        />
                    </View>
                </View>
            );
        }
    };

    render() {
        return (
            <View style={globalStyles.contentSettings}>
                <Header style={globalStyles.headers}>
                    <Left/>
                    <Body>
                    <Title style={globalStyles.headerText}>Settings</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flexDirection: 'row', width: "100%", padding: 10}}>
                    <View style={{width: "70%"}}>
                        <Text style={globalStyles.defaultText}>
                            Participation alert under 75%
                        </Text>
                    </View>
                    <View style={{width: "30%"}}>
                        <Switch
                            onTintColor={styles.$circleWitness}
                            tintColor={styles.$defaultText}
                            thumbTintColor={styles.$witnessListSecondaryText}
                            onValueChange={(value) => this.handleOnToggle(value)}
                            value={this.props.participationAlert}
                        />
                    </View>
                </View>
                <View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                            <Text style={globalStyles.defaultText}>Server URL: </Text>
                        </View>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center', width: '65%'}}>
                            <TextInput
                                placeholderTextColor={styles.$witnessListSecondaryText}
                                style={{fontSize: 12, width: '100%'}}
                                placeholder={this.props.serverUrl}
                                editable={this.state.editable1}
                                onChangeText={(text) => this.setState({textinput1: text})}
                            />
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '10%'}}>
                            {this.changeServerView()}
                        </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '25%'}}>
                            <Text style={globalStyles.defaultText}>Market Url:</Text>
                        </View>
                        <View style={{alignItems: 'flex-start', justifyContent: 'center', width: '65%'}}>
                            <TextInput
                                placeholderTextColor={styles.$witnessListSecondaryText}
                                style={{fontSize: 12, width: '100%'}}
                                placeholder={this.props.marketDataUrl}
                                editable={this.state.editable2}
                                onChangeText={(text) => this.setState({textinput2: text})}
                            />
                        </View>
                        <View style={{alignItems: 'center', justifyContent: 'center', width: '10%'}}>
                            {this.changeMarketDataView()}
                        </View>
                    </View>
                    <View>
                        {this.renderThemeSwitch()}
                    </View>
                </View>
            </View>
        )
    }
}

const styles=EStyleSheet.create({
    $defaultText:'$defaultTextColor',
    $circleWitness:'$circleWitnessScreen',
    $witnessListSecondaryText:'$witnessListSecondaryTextColor',
});

const mapStateToProps = state => {
    return {
        serverUrl: state.server.serverUrl,
        marketDataUrl: state.server.marketDataUrl,
        participationAlert: state.server.participationAlert,
        mode: state.server.mode
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onChangeServerUrl: (url) => dispatch(changeServerUrl(url)),
        onChangeMarketDataUrl: (url) => dispatch(changeMarketDataUrl(url)),
        onToggleParticipation: (value) => dispatch(toggleParticipation(value)),
        onChangeTheme: (value) => dispatch(changeTheme(value))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);